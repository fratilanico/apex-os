import { useState, useEffect } from 'react';

export type QualityLevel = 'high' | 'medium' | 'low';

export interface PerformanceSettings {
  quality: QualityLevel;
  particleCount: number;
  bloomEnabled: boolean;
  bloomIntensity: number;
  gridDetail: number;
  shadowsEnabled: boolean;
}

interface GPUInfo {
  renderer: string;
  vendor: string;
}

/**
 * Detects GPU information using WebGL
 */
function detectGPU(): GPUInfo | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return null;
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) {
      return null;
    }

    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
    const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';

    return { renderer, vendor };
  } catch (error) {
    console.warn('Failed to detect GPU:', error);
    return null;
  }
}

/**
 * Determines quality level based on device capabilities
 */
function determineQuality(gpuInfo: GPUInfo | null, deviceMemory?: number, screenWidth?: number): QualityLevel {
  const renderer = gpuInfo?.renderer.toLowerCase() || '';
  const width = screenWidth || window.innerWidth;

  // LOW quality conditions
  if (renderer.includes('intel') || width < 768) {
    return 'low';
  }

  // HIGH quality conditions
  if (
    renderer.includes('apple m') ||
    renderer.includes('nvidia') ||
    renderer.includes('amd radeon')
  ) {
    return 'high';
  }

  // Check device memory if available (4GB+ = high, 2GB- = low)
  if (deviceMemory !== undefined) {
    if (deviceMemory >= 4) {
      return 'high';
    } else if (deviceMemory <= 2) {
      return 'low';
    }
  }

  // Default to MEDIUM
  return 'medium';
}

/**
 * Generates performance settings based on quality level
 */
function getSettingsForQuality(quality: QualityLevel): PerformanceSettings {
  switch (quality) {
    case 'high':
      return {
        quality: 'high',
        particleCount: 200,
        bloomEnabled: true,
        bloomIntensity: 1.5,
        gridDetail: 32,
        shadowsEnabled: true,
      };
    case 'medium':
      return {
        quality: 'medium',
        particleCount: 100,
        bloomEnabled: true,
        bloomIntensity: 1.0,
        gridDetail: 16,
        shadowsEnabled: false,
      };
    case 'low':
      return {
        quality: 'low',
        particleCount: 50,
        bloomEnabled: false,
        bloomIntensity: 0.5,
        gridDetail: 8,
        shadowsEnabled: false,
      };
  }
}

/**
 * Hook that detects device capabilities and returns optimal performance settings
 * 
 * @example
 * ```tsx
 * const settings = useAdaptivePerformance();
 * 
 * <Canvas>
 *   <ParticleSystem count={settings.particleCount} />
 *   {settings.bloomEnabled && <Bloom intensity={settings.bloomIntensity} />}
 * </Canvas>
 * ```
 */
export function useAdaptivePerformance(): PerformanceSettings {
  const [settings, setSettings] = useState<PerformanceSettings>(() => {
    // Default to medium settings during SSR or initial render
    return getSettingsForQuality('medium');
  });

  useEffect(() => {
    // Detect device capabilities
    const gpuInfo = detectGPU();
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const screenWidth = window.innerWidth;

    // Determine quality level
    const quality = determineQuality(gpuInfo, deviceMemory, screenWidth);

    // Generate settings
    const newSettings = getSettingsForQuality(quality);

    setSettings(newSettings);

    // Log detection results for debugging
    console.log('Adaptive Performance Detection:', {
      gpu: gpuInfo,
      deviceMemory,
      screenWidth,
      quality,
      settings: newSettings,
    });
  }, []);

  return settings;
}

interface FrameMonitorStats {
  fps: number;
  avgFrameTime: number;
  isLowPerformance: boolean;
}

/**
 * Hook that monitors frame rate and detects performance issues
 * 
 * @param lowFPSThreshold - FPS threshold below which performance is considered low (default: 30)
 * @param sampleSize - Number of frames to average over (default: 60)
 * 
 * @example
 * ```tsx
 * const { fps, isLowPerformance } = useFrameMonitor();
 * 
 * {isLowPerformance && <div>Performance warning: {fps.toFixed(0)} FPS</div>}
 * ```
 */
export function useFrameMonitor(
  lowFPSThreshold: number = 30,
  sampleSize: number = 60
): FrameMonitorStats {
  const [stats, setStats] = useState<FrameMonitorStats>({
    fps: 60,
    avgFrameTime: 16.67,
    isLowPerformance: false,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimes: number[] = [];
    let animationFrameId: number;

    const measureFrame = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Store frame time
      frameTimes.push(deltaTime);
      
      // Keep only the last N frames
      if (frameTimes.length > sampleSize) {
        frameTimes.shift();
      }

      frameCount++;

      // Update stats every 30 frames
      if (frameCount % 30 === 0 && frameTimes.length > 0) {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;
        const isLowPerformance = fps < lowFPSThreshold;

        setStats({
          fps,
          avgFrameTime,
          isLowPerformance,
        });
      }

      animationFrameId = requestAnimationFrame(measureFrame);
    };

    animationFrameId = requestAnimationFrame(measureFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [lowFPSThreshold, sampleSize]);

  return stats;
}
