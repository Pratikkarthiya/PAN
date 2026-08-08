import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import { PdfPageItem } from '../types';

/**
 * Extracts and renders each page of an uploaded PDF file into canvas preview image URLs.
 */
export async function renderPdfFileToPages(file: File): Promise<{ previewUrl: string; width: number; height: number }[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const options = { data: uint8, disableWorker: true, disableRange: true };
    let loadingTask = getDocument(options as any);
    let pdf;

    try {
      pdf = await loadingTask.promise;
    } catch (primaryError) {
      console.warn('PDF parse failed with ArrayBuffer, retrying with object URL:', primaryError);
      const objectUrl = URL.createObjectURL(file);
      try {
        loadingTask = getDocument({ url: objectUrl, disableWorker: true, disableRange: true } as any);
        pdf = await loadingTask.promise;
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }

    const renderedPages: { previewUrl: string; width: number; height: number }[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      // Scale 1.5 provides high DPI clarity for text and form details
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        const previewUrl = canvas.toDataURL('image/jpeg', 0.85);
        renderedPages.push({
          previewUrl,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height)
        });
      }
    }
    return renderedPages;
  } catch (err) {
    console.error('Failed to parse uploaded PDF file:', err);
    throw new Error('Could not parse PDF file. Please ensure it is a valid, unencrypted PDF.');
  }
}

/**
 * Builds a compressed standard PDF file using pdf-lib and canvas compression.
 */
export async function createCompressedPdf(
  pages: PdfPageItem[],
  targetKb: number = 300,
  initialQuality: number = 0.75
): Promise<{ pdfBlob: Blob; pdfDataUrl: string; sizeKb: number }> {
  if (pages.length === 0) {
    throw new Error('Please add at least one page to create a PDF.');
  }

  let currentQuality = initialQuality;
  let finalPdfBytes: Uint8Array | null = null;
  let calculatedSizeKb = 0;

  // Retry with decreasing quality if output size exceeds targetKb limit
  for (let attempt = 0; attempt < 5; attempt++) {
    const pdfDoc = await PDFDocument.create();

    for (const pageItem of pages) {
      const img = new Image();
      img.src = pageItem.previewUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image page'));
      });

      // Target max resolution for page (e.g. max 1240px for clean A4 print/view)
      let w = img.width;
      let h = img.height;
      const maxDim = 1240;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((maxDim / w) * h);
          w = maxDim;
        } else {
          w = Math.round((maxDim / h) * w);
          h = maxDim;
        }
      }

      const isRotated = pageItem.rotation === 90 || pageItem.rotation === 270;
      const canvas = document.createElement('canvas');
      canvas.width = isRotated ? h : w;
      canvas.height = isRotated ? w : h;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((pageItem.rotation * Math.PI) / 180);
        const drawW = isRotated ? h : w;
        const drawH = isRotated ? w : h;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // Convert canvas to compressed JPEG
      const jpegDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
      const jpegImageBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());

      // Embed image in PDF
      const pdfImage = await pdfDoc.embedJpg(jpegImageBytes);

      // Standard A4 dimensions in PDF points (595.28 x 841.89)
      const pdfPage = pdfDoc.addPage([595.28, 841.89]);
      const { width: pageW, height: pageH } = pdfPage.getSize();

      const imgAspect = canvas.width / canvas.height;
      const pageAspect = pageW / pageH;
      let drawW = pageW;
      let drawH = pageH;

      if (imgAspect > pageAspect) {
        drawW = pageW;
        drawH = pageW / imgAspect;
      } else {
        drawH = pageH;
        drawW = pageH * imgAspect;
      }

      const x = (pageW - drawW) / 2;
      const y = (pageH - drawH) / 2;

      pdfPage.drawImage(pdfImage, {
        x,
        y,
        width: drawW,
        height: drawH,
      });
    }

    finalPdfBytes = await pdfDoc.save();
    calculatedSizeKb = parseFloat((finalPdfBytes.byteLength / 1024).toFixed(2));

    if (calculatedSizeKb <= targetKb || currentQuality <= 0.2) {
      break;
    }

    // Step down compression quality for next pass
    currentQuality -= 0.15;
  }

  if (!finalPdfBytes) {
    throw new Error('PDF generation failed.');
  }

  const pdfBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });
  const pdfDataUrl = URL.createObjectURL(pdfBlob);

  return {
    pdfBlob,
    pdfDataUrl,
    sizeKb: calculatedSizeKb
  };
}
