import React from 'react';

interface ManifestoLineProps {
  text: string;
  highlight?: string;
  size?: 'normal' | 'large';
}

export const ManifestoLine: React.FC<ManifestoLineProps> = ({
  text,
  highlight,
  size = 'normal',
}) => {
  const parts = highlight ? text.split(highlight) : [text];
  
  const sizeClasses = {
    normal: 'text-xl sm:text-2xl md:text-3xl',
    large: 'text-2xl sm:text-3xl md:text-4xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} font-bold leading-snug`}
    >
      {highlight ? (
        <>
          <span className="text-white/60">{parts[0]}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
            {highlight}
          </span>
          <span className="text-white/60">{parts[1]}</span>
        </>
      ) : (
        <span className="text-white/60">{text}</span>
      )}
    </div>
  );
};
