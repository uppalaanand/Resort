import React,{ useEffect, useRef, useState } from "react";

interface UseInViewAnimation {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
}

const useInViewAnimation = (): UseInViewAnimation => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export default useInViewAnimation;