import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: string;
  duration?: number;
}

const AnimatedCounter = ({ target = "0", duration = 2000 }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const safeTarget = target || "0";
    const numericMatch = safeTarget.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplay(safeTarget);
      return;
    }

    const endValue = parseInt(numericMatch[1]);
    const suffix = safeTarget.slice(numericMatch[1].length);

    if (endValue === 0) {
      setDisplay(`0${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let animationId: number;

    const runAnimation = () => {
      const startTime = performance.now();
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * endValue);
        setDisplay(`${current}${suffix}`);
        if (progress < 1) animationId = requestAnimationFrame(step);
      };
      animationId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
};

export default AnimatedCounter;
