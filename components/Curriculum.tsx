import React from 'react';
import { useEffect } from 'react';
import { ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { useCurriculumStore } from '../stores/useCurriculumStore';
import { useAcademyStore } from '../stores/useAcademyStore';

interface CurriculumProps {
  onOpenCurriculum: () => void;
}

export const Curriculum = React.memo<CurriculumProps>(function Curriculum({ onOpenCurriculum }) {
  const { modules, loadModules } = useCurriculumStore();
  const { selectModule } = useAcademyStore();

  useEffect(() => {
    loadModules().catch(() => undefined);
  }, [loadModules]);

  return (
    <section 
      className="py-24 px-4 max-w-5xl mx-auto relative"
    >
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-cyan-400/70 text-xs uppercase tracking-[0.4em]">
              <BookOpen className="w-4 h-4" />
              Skill Tree: The OASIS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Your curriculum modules live here</h2>
            <p className="text-white/50 max-w-2xl">
              Explore the full learning path, open modules, and dive into documentation from the same interface.
            </p>
          </div>
          <button
            onClick={onOpenCurriculum}
            className="text-cyan-300 text-sm font-mono hover:text-cyan-200 transition-colors flex items-center gap-2"
          >
            Open full curriculum
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-4">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => {
                selectModule(module.id);
                onOpenCurriculum();
              }}
              className="group text-left rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
                  {module.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white truncate">{module.title}</h3>
                    <span className="text-xs text-white/40">{module.duration}</span>
                  </div>
                  <p className="text-white/50 text-sm truncate">{module.subtitle}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{module.objective}</p>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 text-xs">
                  View module
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});
