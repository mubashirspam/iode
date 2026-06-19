'use client';

import { useState, useEffect, useRef } from 'react';

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
  /** 'light' (default) for light backgrounds, 'dark' for dark bands. */
  variant?: 'light' | 'dark';
}

export function StatCounter({ target, suffix = '', prefix = '', label, duration = 2000, className = '', variant = 'light' }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none ${variant === 'dark' ? 'text-white' : 'text-[#15151A]'}`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className={`text-sm font-medium mt-2 ${variant === 'dark' ? 'text-white/60' : 'text-[#8A8A94]'}`}>{label}</p>
    </div>
  );
}
