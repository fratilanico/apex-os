import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Module } from '../../types/curriculum';

interface ModuleSidebarProps {
  modules: Module[];
  activeModuleId: string | null;
  activeSectionId?: string;
  onNavigate: (moduleId: string, sectionId?: string) => void;
}

/**
 * Left sidebar navigation with VS Code-style tree view
 * Shows modules with expand/collapse and section links
 */
export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  modules,
  activeModuleId,
  activeSectionId,
  onNavigate,
}) => {
  // Track which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Auto-expand active module
    return new Set(activeModuleId ? [activeModuleId] : []);
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleModuleClick = (moduleId: string) => {
    // If already active, just toggle expansion
    if (activeModuleId === moduleId) {
      toggleModule(moduleId);
    } else {
      // Navigate to module and expand it
      onNavigate(moduleId);
      setExpandedModules((prev) => new Set([...prev, moduleId]));
    }
  };

  return (
    <div className="w-72 sm:w-80 border-r border-white/10 bg-[#0a0a0a] overflow-y-auto h-full">
      <div className="p-4">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
          Curriculum
        </h3>

        <div className="space-y-1">
          {modules.map((module) => {
            const isActive = activeModuleId === module.id;
            const isExpanded = expandedModules.has(module.id);
            const IconComponent = (LucideIcons as any)[module.icon] || LucideIcons.Box;

            return (
              <div key={module.id}>
                {/* Module Header */}
                <button
                  onClick={() => handleModuleClick(module.id)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 rounded-lg
                    text-left transition-all duration-150
                    ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  {/* Expand/Collapse Icon */}
                  <span className="text-white/40">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>

                  {/* Module Icon */}
                  <IconComponent className="w-4 h-4" />

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono opacity-60">
                        {module.number}
                      </span>
                      <span className="font-semibold truncate">
                        {module.title}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Sections (when expanded) */}
                {isExpanded && (
                  <div className="ml-9 mt-1 space-y-1">
                    {module.sections.map((section) => {
                      const isSectionActive = activeSectionId === section.id;

                      return (
                        <button
                          key={section.id}
                          onClick={() => onNavigate(module.id, section.id)}
                          className={`
                            w-full text-left px-3 py-1.5 rounded text-sm
                            transition-all duration-150
                            ${
                              isSectionActive
                                ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                            }
                          `}
                        >
                          <span className="text-xs font-mono opacity-60 mr-2">
                            {section.id}
                          </span>
                          <span className="truncate">{section.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
