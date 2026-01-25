import React from 'react';

// ============================================================================
// Platform Logo Components - Official brand SVG logos
// ============================================================================

interface LogoProps {
  className?: string;
  size?: number;
}

// Vercel Logo - Official triangle logo
export const VercelLogo: React.FC<LogoProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 76 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
  </svg>
);

// AWS Amplify Logo - AWS smile/arrow logo
export const AWSAmplifyLogo: React.FC<LogoProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="aws-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#F90', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FF5722', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* AWS Smile Arrow */}
    <path
      d="M190.5 92.7c-18.6-13.7-45.4-20.9-68.6-20.9-32.5 0-61.8 12-83.8 32-1.7 1.5-0.2 3.6 1.9 2.4 23.6-13.7 52.8-22 83-22 20.3 0 42.7 4.2 63.2 12.9 3.1 1.3 5.7-2 2.3-4.4z"
      fill="url(#aws-gradient)"
    />
    <path
      d="M199.4 82.7c-2.4-3.1-15.8-1.5-21.8-0.7-1.8 0.2-2.1-1.4-0.5-2.5 10.7-7.5 28.2-5.3 30.2-2.8 2 2.5-0.5 19.9-10.5 28.2-1.5 1.3-2.9 0.6-2.2-1.1 2.3-5.7 7.3-18.5 4.8-21.1z"
      fill="url(#aws-gradient)"
    />
    {/* AWS "A" Symbol */}
    <path
      d="M107 140.5l-23.9 11v10.3l23.9-11.5v-9.8zm28 13.1l-23.8 11.5v10.3l23.8-11.5v-10.3zm-55.9-13.1L55.2 152v10.3l23.9-11.5v-9.8zm0 26.2L55.2 178v10.3l23.9-11.5v-10.1zm28-13.1L83.2 165v10.3l23.9-11.5v-9.8zm28 13.1l-23.9 11v10.3l23.9-11.5v-10.1zm27.9-13.1l-23.8 11v10.3l23.8-11.5v-9.8z"
      fill="url(#aws-gradient)"
    />
  </svg>
);

// Railway Logo - Purple/pink gradient railway
export const RailwayLogo: React.FC<LogoProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="railway-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="256" height="256" rx="60" fill="url(#railway-gradient)" />
    <path
      d="M121 32L71 82L121 132L71 182H91L141 132L191 182H211L161 132L211 82H191L141 132L91 82H71L121 32L171 82L121 132L121 32Z"
      fill="white"
    />
  </svg>
);

// Cloudflare Logo - Orange Cloudflare logo
export const CloudflareLogo: React.FC<LogoProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="cloudflare-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#F38020', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FAAE40', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Cloudflare Cloud Shape */}
    <path
      d="M195.6 142.7c0.9-3.3 1.4-6.8 1.4-10.4 0-21.8-17.7-39.5-39.5-39.5-4.3 0-8.4 0.7-12.3 2-6.8-15.5-22.3-26.3-40.2-26.3-24.3 0-44 19.7-44 44 0 1.5 0.1 3 0.2 4.4-0.1 0-0.1 0-0.2 0-17.7 0-32 14.3-32 32s14.3 32 32 32h127.5c15.2 0 27.5-12.3 27.5-27.5 0-13.4-9.6-24.6-22.4-27.2z"
      fill="url(#cloudflare-gradient)"
    />
    {/* Cloudflare Lightning Bolt */}
    <path
      d="M108 100L84 140H104L92 180L116 140H96L108 100Z"
      fill="white"
    />
  </svg>
);

// Component to render logo based on platform ID
interface PlatformLogoProps {
  platformId: string;
  size?: number;
  className?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ 
  platformId, 
  size = 32, 
  className = '' 
}) => {
  switch (platformId) {
    case 'vercel':
      return <VercelLogo size={size} className={className} />;
    case 'aws':
      return <AWSAmplifyLogo size={size} className={className} />;
    case 'railway':
      return <RailwayLogo size={size} className={className} />;
    case 'cloudflare':
      return <CloudflareLogo size={size} className={className} />;
    default:
      return null;
  }
};
