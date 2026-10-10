"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { featuredWork, type WorkspaceProject } from "@/data/workspace";
import "./showcase.css";
export type ShowcaseId = "labstock" | "suhulog" | "bdrs";

/** A viewer of cleared product evidence, never a simulation of the application. */
export function EvidenceStage({ initial = "labstock", onAsk, onOpen, compact = false }: {
  initial?: ShowcaseId;
  onAsk?: (question: string) => void;
  onOpen?: (project: WorkspaceProject) => void;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState(initial);
  const [page, setPage] = useState(0);
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 130, damping: 26 });
  const rotateY = useSpring(y, { stiffness: 130, damping: 26 });
  const project = featuredWork.find(item => item.slug === selected)!;
  const screens = [{ src: project.image!, caption: `${project.title} · product overview` }, ...(project.gallery ?? [])];
  const screen = screens[page] ?? screens[0];
  const reset = () => { x.set(0); y.set(0); };
  return <section className={`evidence-stage${compact ? " is-compact" : ""}`} aria-label="Explore real project screens" data-project={selected}>
    <header className="evidence-heading"><span>From the working software</span><span>0{featuredWork.findIndex(p => p.slug === selected) + 1} / 03</span></header>
    <div className="evidence-space" onPointerMove={event => {
      if (reduced || event.pointerType !== "mouse" || !matchMedia("(hover:hover) and (min-width:761px)").matches) return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 3);
      y.set((event.clientX - rect.left - rect.width / 2) / rect.width * 4);
    }} onPointerLeave={reset}>
      <motion.figure className="evidence-screen" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.a key={screen.src} href={screen.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size screenshot: ${screen.caption}`}
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .24, ease: [.16, 1, .3, 1] }}>
            <Image src={screen.src} alt={screen.caption} width={1600} height={1000} sizes="(max-width:760px) 100vw, 900px" style={{ objectFit: "contain" }} />
            <span className="evidence-open" aria-hidden="true">Inspect full size ↗</span>
          </motion.a>
        </AnimatePresence>
      </motion.figure>
    </div>
    <div className="evidence-pagination"><p aria-live="polite">{String(page + 1).padStart(2, "0")} — {screen.caption}</p><div><button type="button" aria-label="Previous screenshot" disabled={page === 0} onClick={() => { setPage(page - 1); reset(); }}>←</button><button type="button" aria-label="Next screenshot" disabled={page === screens.length - 1} onClick={() => { setPage(page + 1); reset(); }}>→</button></div></div>
    <div className="evidence-projects" role="group" aria-label="Choose a project to inspect">{featuredWork.map((item, index) => <button type="button" key={item.slug} aria-pressed={selected === item.slug} onClick={() => { setSelected(item.slug as ShowcaseId); setPage(0); reset(); }}><small>0{index + 1}</small><strong>{item.title}</strong><span aria-hidden="true">↗</span></button>)}</div>
    <div className="evidence-context"><p>Real application screens · synthetic demo data</p><div>{onAsk && <button type="button" onClick={() => onAsk(project.askSuggestion)}>Ask about {project.title} ↗</button>}<a href={`/projects/${project.slug}/`} onClick={event => { if (!onOpen || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onOpen(project); }}>Read the case ↗</a></div></div>
  </section>;
}
