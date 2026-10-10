"use client";
import {useEffect, useRef} from "react";
import "./workspace-motion.css";

// Animate the existing page content. No alternate layouts or generated evidence.
export function useWorkspaceMotion(destination: string) {
  const stage = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = stage.current;
    const main = root?.querySelector<HTMLElement>("main");
    if (!root || !main) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const running = new Set<Animation>();
    const animate = (element: Element, frames: Keyframe[], delay = 0) => {
      if (preference.matches || document.hidden) return;
      const animation = element.animate(frames, {
        duration: 420, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards",
      });
      running.add(animation);
      void animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
    };
    const finish = () => { running.forEach(animation => animation.cancel()); running.clear(); };
    animate(main, [{opacity: .65, transform: "translateY(10px)"}, {opacity: 1, transform: "none"}]);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Copy and controls arrive independently; authentic screenshots stay intact.
        const parts = entry.target.querySelectorAll("h2, h3, p, strong, small");
        parts.forEach((part, index) => animate(part,
          [{opacity: .3, transform: "translateY(12px)"}, {opacity: 1, transform: "none"}],
          Math.min(index, 3) * 45));
      });
    }, {root: main.scrollHeight > main.clientHeight ? main : null, threshold: .18});
    main.querySelectorAll(".home-project, .aw-work-case, .studio-approach li, .studio-systems a, .study-heading, .study-brief, .study-proof, .ls-section-heading, .aw-project-objects > button").forEach(element => observer.observe(element));
    const onPreference = () => { if (preference.matches) finish(); };
    const onVisibility = () => { if (document.hidden) finish(); };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect(); finish();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [destination]);
  return stage;
}
