"use client";
import { useEffect } from "react";
import "./spatial.css";

// Presentation only: original DOM, links, images and focus ownership stay intact.
// Native timelines run finitely; there is no pointer tracking or idle frame loop.
export function SpatialMotion({ navigationKey }: { navigationKey: string }) {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".aw-stage");
    if (!stage || !Element.prototype.animate || !window.IntersectionObserver) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 760px)");
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const observed = new Set<Element>();
    const selector = ".home-proof img, .home-project figure img, .aw-work-case figure img, .study-media img, .ls-hero img, .ls-screen img, .studio-approach li";
    const cancel = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (seen.has(entry.target)) continue;
        seen.add(entry.target);
        if (reduced.matches || document.hidden) continue;
        const element = entry.target as HTMLElement;
        const text = element.matches("li");
        // Image loading never gates visibility. Wait for decode only to avoid
        // spending the entrance on an empty image on a slower connection.
        const ready = element instanceof HTMLImageElement ? element.decode().catch(() => {}) : Promise.resolve();
        void ready.then(() => {
          if (!element.isConnected || reduced.matches || document.hidden || disposed) return;
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > innerHeight) return;
          const from = text || mobile.matches ? "translateY(12px)" : "perspective(1400px) translateY(22px) rotateX(10deg) rotateY(-6deg) scale(.94)";
          const animation = element.animate([
            { transform: from, opacity: text ? .65 : 1 },
            { transform: "none", opacity: 1 },
          ], { duration: text ? 560 : mobile.matches ? 600 : 1050, easing: "cubic-bezier(.22,.8,.22,1)" });
          animations.add(animation);
          void animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
        });
      }
    }, { threshold: .18 });
    let disposed = false;
    function scan() {
      stage!.querySelectorAll(selector).forEach(element => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    }
    scan();
    // Dynamic case-study chunks and workflow image changes join the same system.
    const mutations = new MutationObserver(scan);
    mutations.observe(stage, { childList: true, subtree: true });
    const visibility = () => { if (document.hidden) cancel(); };
    reduced.addEventListener("change", cancel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancel(); observer.disconnect(); mutations.disconnect();
      reduced.removeEventListener("change", cancel);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [navigationKey]);
  return null;
}
