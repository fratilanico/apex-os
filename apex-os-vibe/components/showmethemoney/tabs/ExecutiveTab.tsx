import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Target, Award, ArrowRight } from 'lucide-react';
import { MetricCard } from '../shared/MetricCard';
import { SectionHeader } from '../shared/SectionHeader';
import { GrowthChart } from '../charts/GrowthChart';

interface ExecutiveTabProps {
  projections?: any[];
}

export const ExecutiveTab: React.FC<ExecutiveTabProps> = ({ projections }) => {
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const subtitle = "Comprehensive financial strategy and global scale-up protocols";
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Typewriter effect
  useEffect(() => {
    if (!isInView) return;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= subtitle.length) {
        setDisplayedSubtitle(subtitle.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [isInView]);

  const metrics = [
    {
      value: 501000,
      prefix: '$',
      suffix: 'K',
      label: 'Year 1 Revenue',
      sublabel: 'Projected',
      trend: 12,
      trendLabel: 'vs target',
      color: 'emerald' as const,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      value: 9.8,
      suffix: ':1',
      label: 'LTV:CAC Ratio',
      sublabel: 'Best-in-class',
      color: 'amber' as const,
      icon: <Target className="w-5 h-5" />,
    },
    {
      value: 1466,
      prefix: '$',
      label: 'Customer LTV',
      sublabel: '12-Month Value',
      color: 'violet' as const,
      icon: <Award className="w-5 h-5" />,
    },
    {
      value: 150,
      prefix: '$',
      label: 'Blended CAC',
      sublabel: 'Emerging + West',
      color: 'cyan' as const,
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-8"
        >
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">🤫 TOP SECRET</span>
          <span className="text-white/60 text-sm">| APEX OS Business Plan 2026</span>
        </motion.div>

        {/* Title with Gradient Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">SHOW ME THE </span>
          <motion.span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, #10b981, #22d3ee, #a78bfa, #10b981)',
              backgroundSize: '300% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            MONEY
          </motion.span>
        </motion.h1>

        {/* Typewriter Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/60 mb-8 max-w-3xl mx-auto h-8"
        >
          {displayedSubtitle}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 align-middle"
          />
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base text-white/40 max-w-2xl mx-auto"
        >
          Converting 32,000 InfoAcademy students into technical founders through 
          sovereign education and AI-powered acceleration.
        </motion.p>
      </section>

      {/* Key Metrics Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Growth Trajectory Chart */}
      <section className="mt-12">
        <SectionHeader
          title="Growth Trajectory"
          subtitle="18-month revenue projection with Base and Monster scenarios"
          align="center"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8"
        >
          <GrowthChart projections={projections} />
        </motion.div>
      </section>

      {/* Investor Hook Statement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="relative max-w-4xl mx-auto mt-16"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-violet-400 to-emerald-400 rounded-full" />
        <div className="pl-8 py-4">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-white/90 leading-relaxed">
            "The mathematical blueprint for converting 
            <span className="text-cyan-400"> 32,000 students </span>
            into 
            <span className="text-emerald-400"> $501K Year 1 revenue </span>
            at 
            <span className="text-amber-400"> 9.8:1 LTV:CAC</span>."
          </blockquote>
          <div className="mt-4 flex items-center gap-2 text-white/40">
            <span className="text-sm uppercase tracking-widest">— APEX OS</span>
            <span className="text-white/20">|</span>
            <span className="text-sm">2026</span>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="text-center mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
        >
          Explore the Financial Model
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.section>
    </div>
  );
};

export default ExecutiveTab;
