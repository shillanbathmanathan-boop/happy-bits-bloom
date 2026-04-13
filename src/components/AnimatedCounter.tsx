import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: string;
  duration?: number;
}

const AnimatedCounter = ({ target = "0", duration = 2000 }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const animationId = useRef<number>();

  useEffect(() => {
    const safeTarget = target || "0";
    const numericMatch = safeTarget.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplay(safeTarget);
      return;
    }

    const endValue = parseInt(numericMatch[1]);
    const suffix = safeTarget.slice(numericMatch[1].length);

    // Show final value immediately if zero
    if (endValue === 0) {
      setDisplay(`0${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) { setDisplay(`${endValue}${suffix}`); return; }

    const runAnimation = () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      const startTime = performance.now();
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${Math.round(eased * endValue)}${suffix}`);
        if (progress < 1) animationId.current = requestAnimationFrame(step);
      };
      animationId.current = requestAnimationFrame(step);
    };

    // If already visible, animate immediately
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
};

export default AnimatedCounter;
