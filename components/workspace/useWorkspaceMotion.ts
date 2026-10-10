"use client";
import {useEffect, useRef} from "react";
import "./workspace-motion.css";

const details = [
  "[data-motion-words]", "[data-motion-detail]", ".home-identity", ".home-guide .aw-composer",
  ".home-starters button", ".home-intro-actions", ".evidence-heading", ".evidence-space",
  ".evidence-pagination", ".evidence-projects button", ".evidence-context",
  ".home-project figure", ".aw-project-objects>button>figure", ".aw-project-objects>button>.aw-object-evidence",
  ".studio-approach li>span", ".studio-approach li>p", ".studio-systems small",
  ".study-media", ".ls-hero", ".ls-screen", ".study-label", ".ls-eyebrow",
  ".ls-decision-number", ".ls-evidence>div", ".study-proof>div", ".aw-project-back",
].join(",");

/** Separate beats for the actual words, media and controls. Finite and idle-free. */
export function useWorkspaceMotion(destination: string) {
  const stage = useRef<HTMLElement>(null);
  const shellPlayed = useRef(false);
  useEffect(() => {
    const root = stage.current;
    const main = root?.querySelector<HTMLElement>("main");
    if (!root || !main) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const running = new Set<Animation>();
    const observed = new WeakSet<Element>();
    let disposed = false;
    const animate = (element: Element, frames: Keyframe[], delay = 0, duration = 800) => {
      if (preference.matches || document.hidden || disposed) return;
      const animation = element.animate(frames, {
        duration, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards",
      });
      running.add(animation);
      void animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
    };
    const finish = () => { running.forEach(animation => animation.cancel()); running.clear(); };
    const play = (element: Element) => {
      const ownDelay = Number(element.getAttribute("data-motion-delay") || 0);
      if (element.matches("[data-motion-words]")) {
        const heading = Boolean(element.closest("h1,h2,h3,strong"));
        element.querySelectorAll(".motion-word").forEach((part, index) => animate(part, [
          {transform: `translateY(${heading ? 112 : 105}%) rotateX(${heading ? 24 : 0}deg)`, opacity: 0},
          {transform: "translateY(0) rotateX(0deg)", opacity: 1},
        ], ownDelay + Math.min(index * (heading ? 72 : 18), heading ? 650 : 420), heading ? 900 : 650));
        return;
      }
      const media = element.matches("figure,.evidence-space,.study-media,.ls-screen");
      let delay = ownDelay;
      if (element.matches(".home-guide .aw-composer")) delay += 520;
      if (element.matches(".evidence-space")) delay += 360;
      if (element.matches(".evidence-pagination,.evidence-context")) delay += 700;
      if (element.matches(".home-starters button,.evidence-projects button")) {
        delay += 680 + Array.from(element.parentElement!.children).indexOf(element) * 90;
      }
      animate(element, media ? [
        {opacity: 0, clipPath: "inset(9% 0 91% 0 round 4px)", transform: "translateY(32px) scale(.96)"},
        {opacity: 1, clipPath: "inset(0% 0 0% 0 round 4px)", transform: "translateY(0) scale(1)"},
      ] : [
        {opacity: 0, transform: "translateY(22px)"},
        {opacity: 1, transform: "translateY(0)"},
      ], delay, media ? 1100 : 650);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        play(entry.target);
      });
    }, {root: main.scrollHeight > main.clientHeight ? main : null, threshold: .12});
    const register = () => {
      main.querySelectorAll(details).forEach(element => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
    };
    const shell = () => {
      root.closest(".aw-window")?.querySelectorAll(".aw-primary-nav button").forEach((element, index) =>
        animate(element, [{opacity: 0, transform: "translateX(-18px)"}, {opacity: 1, transform: "none"}], index * 65, 650));
    };
    register();
    if (!shellPlayed.current) { shell(); shellPlayed.current = true; }
    const mutations = new MutationObserver(register);
    mutations.observe(main, {childList: true, subtree: true});
    const replay = () => {
      finish();
      main.scrollTo({top: 0, behavior: "instant"});
      shell();
      const bounds = main.getBoundingClientRect();
      main.querySelectorAll(details).forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom > Math.max(0, bounds.top) && rect.top < Math.min(innerHeight, bounds.bottom)) play(element);
      });
    };
    const onPreference = () => { if (preference.matches) finish(); };
    const onVisibility = () => { if (document.hidden) finish(); };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const target = event.target;
        running.forEach(animation => {
          const element = (animation.effect as KeyframeEffect | null)?.target;
          if (element && (element === target || element.contains(target))) animation.cancel();
        });
      }
    };
    root.addEventListener("focusin", onFocus);
    root.addEventListener("jagau:replay-motion", replay);
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true; observer.disconnect(); mutations.disconnect(); finish();
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("jagau:replay-motion", replay);
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [destination]);
  return stage;
}
