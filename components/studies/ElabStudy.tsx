"use client";
import { MotionWords } from "@/components/workspace/MotionWords";
import { Brief, Record, Proof, Boundary } from "./StudyPrimitives";
import type { WorkspaceProject } from "@/data/workspace";
export function ElabStudy({project}:{project:WorkspaceProject}) {
  return <article className="study" aria-labelledby="elab-title">
    <header className="study-header"><p className="study-label">{project.eyebrow} · {project.status}</p><h1 id="elab-title"><MotionWords>ELAB</MotionWords></h1><p>{project.summary}</p></header>
    <Record project={project}/><Brief project={project}/>
    <section className="study-brief"><div><span className="study-label">Workflow</span><h2><MotionWords>Access and history, kept distinct.</MotionWords></h2></div><ol>{project.howItWorks.map(item=><li key={item}>{item}</li>)}</ol></section>
    <section className="study-brief"><div><span className="study-label">Engineering decisions</span><h2><MotionWords>Explicit document semantics.</MotionWords></h2></div><div>{project.decisions?.map(item=><section key={item.title}><h3><MotionWords>{item.title}</MotionWords></h3><p>{item.detail}</p></section>)}</div></section>
    <Proof project={project}/><Boundary project={project}/>
  </article>;
}
