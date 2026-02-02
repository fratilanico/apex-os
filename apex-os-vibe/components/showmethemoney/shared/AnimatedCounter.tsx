import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  separator?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  separator = ',',
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          separator={separator}
          useEasing={true}
          easingFn={(t, b, c, d) => {
            // easeOutExpo
            return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
          }}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export default AnimatedCounter;
