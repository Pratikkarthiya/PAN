import React, { useState } from 'react';
import { Screen, ContactFormData } from '../types';
import { AdBanner } from './AdBanner';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle, Bug } from 'lucide-react';

interface ContactUsPageProps {
  onNavigate: (screen: Screen) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'PAN Specification Query',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#050505] text-[#F5F5F5] min-h-screen py-16 px-6 sm:px-8 lg:px-12 font-sans selection:bg-[#E5C38B] selection:text-black">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E5C38B] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-md">
            <Mail className="w-3.5 h-3.5 text-[#E5C38B]" />
            <span>Support &amp; Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F5F5]">
            Contact <span className="italic text-[#E5C38B]">Us</span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm max-w-md mx-auto font-light">
            Have questions about PAN specifications, file size optimization, or tool feedback? Get in touch with our team.
          </p>
          <AdBanner type="leaderboard" className="pt-2" />
        </div>

        {/* Form Container */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-[#F5F5F5]">
                Message Received!
              </h2>
              <p className="text-xs text-white/70 max-w-sm mx-auto font-light">
                Thank you for contacting KP CYBER. Our support team will review your inquiry shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'PAN Specification Query', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-white/80 border border-white/20 text-xs font-semibold hover:border-[#E5C38B] hover:text-white cursor-pointer transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono placeholder-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">
                  Subject Category
                </label>
                <select
                  id="contact-subject-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono"
                >
                  <option value="PAN Specification Query" className="bg-[#050505]">PAN Specification Query</option>
                  <option value="Bug Report / Tool Issue" className="bg-[#050505]">Bug Report / Tool Issue</option>
                  <option value="Feature Suggestion" className="bg-[#050505]">Feature Suggestion</option>
                  <option value="General Feedback" className="bg-[#050505]">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">
                  Message Details *
                </label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={5}
                  placeholder="Describe your issue or question regarding photo, signature, or PDF compression..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#E5C38B] font-mono placeholder-white/30"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-xs uppercase tracking-[0.15em] text-black bg-[#E5C38B] hover:bg-white transition-all shadow-lg shadow-[#E5C38B]/10 cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Submit Message</span>
              </button>

            </form>
          )}
        </div>

        {/* Bottom Page Ad Banner */}
        <AdBanner type="leaderboard" className="pt-4" />

      </div>
    </div>
  );
};
