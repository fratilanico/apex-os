// import { useGameEngine } from '../../stores/gameEngine'; // TODO: Implement game engine store
import { XPBar } from '../XPBar';

export function GameHUD() {
  // TODO: Replace with actual useGameEngine hook when implemented
  const currentObjective = 'Explore the system...';
  const notifications: Array<{ message: string }> = [];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top-left: Current Objective */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <div className="bg-black/60 border border-tron-cyan/30 p-4 rounded backdrop-blur-sm">
          <h3 className="text-tron-cyan font-mono text-sm uppercase tracking-wider mb-2">
            Current Objective
          </h3>
          <p className="text-white/90 font-mono text-base">
            {currentObjective || 'Explore the system...'}
          </p>
        </div>
      </div>

      {/* Top-right: Notification Area */}
      <div className="absolute top-8 right-8 pointer-events-auto flex flex-col gap-3 max-w-sm">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-black/70 border border-tron-yellow/50 p-4 rounded backdrop-blur-sm animate-pulse"
          >
            <h4 className="text-tron-yellow font-mono text-xs uppercase tracking-wider mb-1">
              Achievement Unlocked
            </h4>
            <p className="text-white font-mono text-sm">{notification.message}</p>
          </div>
        ))}
      </div>

      {/* Bottom: XP Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8 pointer-events-auto">
        <div className="bg-black/60 border border-tron-cyan/30 p-3 rounded backdrop-blur-sm">
          <XPBar 
            className="[&_.xp-bar-fill]:bg-gradient-to-r [&_.xp-bar-fill]:from-tron-cyan [&_.xp-bar-fill]:to-tron-blue
                       [&_.xp-bar-container]:bg-black/40 [&_.xp-bar-container]:border-tron-cyan/20
                       [&_.xp-text]:text-tron-cyan [&_.xp-text]:font-mono [&_.xp-text]:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
