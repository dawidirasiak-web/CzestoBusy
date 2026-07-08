"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollVan({ children }: { children: ReactNode }) {
  const vanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = vanRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    function updatePosition() {
      frame = 0;
      const travel = Math.min(window.innerWidth * 0.11, 145);
      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.9), 0), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const lift = Math.sin(progress * Math.PI) * -4;
      element!.style.transform = `translate3d(${easedProgress * travel}px, ${lift}px, 0)`;
      element!.style.setProperty("--wheel-turn", `${progress * 540}deg`);
    }

    function requestUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
    }

    updatePosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-van" ref={vanRef}>{children}</div>;
}
