import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#020202] py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">InfoAcademy AI</h3>
          <p className="text-white/40 text-sm">Building the builders of tomorrow.</p>
        </div>

        <div className="flex items-center gap-6">
          {[
            { icon: Twitter, href: "#" },
            { icon: Github, href: "#" },
            { icon: Linkedin, href: "#" },
            { icon: Mail, href: "mailto:vibe@infoacademy.ro" }
          ].map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              whileHover={{ y: -2 }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-cyan-400 hover:bg-white/10 transition-all flex-shrink-0"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            </motion.a>
          ))}
        </div>

        <div className="text-white/20 text-xs font-mono">
          © 2026 INFOACADEMY. SYSTEM_ONLINE.
        </div>
      </div>
    </footer>
  );
};
