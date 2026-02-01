// ShowMeTheMoney Page - Placeholder
// Content will be updated as per user requirements
// URL: https://vibe-infoacademy-pearl.vercel.app/showmethemoney

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Sparkles } from 'lucide-react';

const ShowMeTheMoneyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-10 h-10 text-cyan-400" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter mb-4">
          Show Me The Money
        </h1>

        <p className="text-white/60 text-lg mb-8">
          This page is under construction. Content will be added soon.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-white/40 font-mono">
          <Sparkles className="w-4 h-4" />
          <span>Coming Soon</span>
        </div>

        <div className="mt-12 p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <p className="text-xs text-white/30 font-mono">
            Target: https://vibe-infoacademy-pearl.vercel.app/showmethemoney
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ShowMeTheMoneyPage;
