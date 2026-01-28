import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { useAdaptivePerformance } from '../../../hooks/useAdaptivePerformance';

export function TronPostProcessing() {
  const { quality, bloomEnabled, bloomIntensity } = useAdaptivePerformance();

  if (!bloomEnabled) {
    return null;
  }

  if (quality === 'high') {
    return (
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={bloomIntensity}
          radius={0.8}
        />
        <ChromaticAberration offset={[0.001, 0.001]} />
        <Vignette darkness={0.4} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        radius={0.8}
      />
    </EffectComposer>
  );
}
