"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./spatial.css";
export function MotionStudy() {
  const root = useRef<HTMLDivElement>(null);
  const running = useRef<Animation[]>([]);
  function play() {
    running.current.forEach(animation => animation.cancel());
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = Array.from(root.current?.querySelectorAll(".motion-study-screen") ?? []).map((element, index) => element.animate(index === 0 ? [
      { transform: "perspective(1200px) rotateX(12deg) rotateY(-9deg) translateY(20px) scale(.91)" },
      { transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)" },
    ] : [
      { transform: "perspective(1600px) rotateY(18deg) translateX(-36px) scale(.88)", opacity: .5 },
      { transform: "perspective(1600px) rotateY(-2deg) translateX(4px) scale(.99)", opacity: 1, offset: .75 },
      { transform: "perspective(1600px) rotateY(0deg) translateX(0) scale(1)", opacity: 1 },
    ], { duration: index === 0 ? 1100 : 1500, easing: "cubic-bezier(.16,1,.3,1)" }));
  }
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => running.current.forEach(animation => animation.cancel());
    preference.addEventListener("change", stop);
    return () => { stop(); preference.removeEventListener("change", stop); };
  }, []);
  return <div ref={root} className="motion-study"><header><Link href="/">← Workspace</Link><h1>LabStock / motion studies</h1><p>Two presentations of the same cleared screenshot. These are images, not a simulated product interface.</p><button onClick={play}>Play both treatments</button></header><div className="motion-study-grid">{["01 / Desk lift", "02 / Camera settle"].map((label, index) => <section key={label}><h2>{label}</h2><div className="motion-study-stage"><Image className="motion-study-screen" src="/projects/labstock/today-detail.webp" width={1136} height={888} alt={`LabStock public screenshot — ${label}`} priority /></div><p>{index === 0 ? "A single, restrained approach toward the reader." : "A lateral camera approach with a longer settling phase."}</p></section>)}</div></div>;
}
