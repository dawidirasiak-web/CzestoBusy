"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FleetReveal({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grid.classList.add("is-visible");
      return;
    }

    grid.classList.add("reveal-ready");
    const reveal = () => grid.classList.add("is-visible");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        reveal();
        observer.disconnect();
      }
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    observer.observe(grid);
    grid.addEventListener("focusin", reveal, { once: true });

    return () => {
      observer.disconnect();
      grid.removeEventListener("focusin", reveal);
    };
  }, []);

  return <div className="fleet-grid fleet-reveal" ref={gridRef}>{children}</div>;
}
