import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formspree.io/f/xwpkgpvd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `[Vibe Contact] New message from ${formState.name}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setFormState({ name: '', email: '', message: '' });
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again or email us directly.'
      );
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-xl p-12 text-center"
      >
        <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mx-auto mb-4 flex-shrink-0">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-white/60">We'll get back to you within 24 hours.</p>
      </motion.div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-xl p-12 text-center"
      >
        <div className="inline-flex w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 items-center justify-center mx-auto mb-4 flex-shrink-0">
          <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Failed to Send</h3>
        <p className="text-white/60 mb-4">{errorMessage}</p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
        <p className="text-xs text-white/40 mt-4">
          Or email us directly at{' '}
          <a href="mailto:vibe@infoacademy.ro" className="text-cyan-400 hover:text-cyan-300">
            vibe@infoacademy.ro
          </a>
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
          placeholder="John Doe"
          enterKeyHint="next"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
          placeholder="john@company.com"
          enterKeyHint="next"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          placeholder="Tell us about your project..."
          enterKeyHint="send"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitStatus === 'submitting'}
        className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {submitStatus === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-white/40 text-center">
        We'll respond within 24 hours. Or email us directly at{' '}
        <a href="mailto:vibe@infoacademy.ro" className="text-cyan-400 hover:text-cyan-300">
          vibe@infoacademy.ro
        </a>
      </p>
    </form>
  );
};
