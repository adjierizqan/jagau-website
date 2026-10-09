"use client";
import type { ReactNode } from "react";
import Image from "next/image";
import { featuredWork, type WorkspaceProject } from "@/data/workspace";
import { identity, education } from "@/data/profile";
import { site } from "@/data/site";
import "./home.css";
import { navigateToSection } from "@/lib/section-navigation";
export function WorkspaceHome({
  selectProject,
  openAsk,
  composer,
  askQuestion,
  busy = false,
}: {
  selectProject: (p: WorkspaceProject) => void;
  openAsk: () => void;
  composer: ReactNode;
  busy?: boolean;
  askQuestion: (question: string) => void;
}) {
  return (
    <main className="aw-center workspace-home aw-enter">
      <header className="home-intro">
        <div className="home-identity">
          <div><h1>{identity.name}</h1><p>Independent software studio · Indonesia</p></div>

        </div>
        <section className="home-start" aria-label="Explore JAGAU">
          <h2>What would you like to know?</h2>
          <p className="home-positioning">Ask about the studio, or open founder work to see how it was built. Curated answers · no live AI.</p>
          {composer}
          <div className="home-starters" aria-label="Suggested questions">
            {[
              ["Start with the work", "What has JAGAU built?"],
              ["How we build", "How do you build reliable operational software?"],
              ["About JAGAU", "What does JAGAU mean?"],
            ].map(([label, question]) => <button key={label} type="button" disabled={busy} onClick={() => askQuestion(question)}>{label} <span aria-hidden="true">↗</span></button>)}
          </div>
          <nav className="home-proof" aria-label="Open a project">
            {featuredWork.slice(0,3).map(project => <a key={project.slug} href={`/projects/${project.slug}/`} onClick={event => { event.preventDefault(); selectProject(project); }}>
              <Image src={project.thumb!} alt={project.title + " product preview"} width={1600} height={1000} sizes="(max-width:760px) 30vw, 230px" />
              <span>{project.title}<small>{project.eyebrow}</small></span>
            </a>)}
          </nav>
          <nav className="home-intro-actions" aria-label="Introduction actions">
            <a href="#home-work" onClick={navigateToSection}>Explore the work ↓</a>

          </nav>
        </section>
      </header>
      <section className="home-selected" aria-labelledby="home-work">
        <header>
          <h2 id="home-work" tabIndex={-1}>Selected work</h2>
          <span>The work behind the answer</span>
        </header>
        <div className="home-work-list">
          {featuredWork.map((p, i) => (
            <a
              href={`/projects/${p.slug}/`}
              key={p.slug}
              onClick={(e) => {
                e.preventDefault();
                selectProject(p);
              }}
              className={`home-project home-project-${i}`}
            >
              <figure>
                <Image
                  src={p.thumb!}
                  alt={p.title + " public project evidence"}
                  width={1600}
                  height={1000}
                  sizes="(max-width:760px) 100vw, 700px"
                  preload={i === 0}
                />
              </figure>
              <div>
                <span>
                  0{i + 1} / {p.eyebrow}
                </span>
                <h3>
                  {p.title}
                  <b aria-hidden="true">↗</b>
                </h3>
                <p>{p.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="home-ask">
        <div>
          <h2>There’s more behind each screen.</h2>
          <p>Ask about the architecture, decisions or evidence.</p>
        </div>
        <button type="button" onClick={openAsk}>
          Explore ↗
        </button>
      </section>
      <section className="home-about">
        <div>
          <h2>Engineering, with context.</h2>
          <p>
            JAGAU is an independent software practice rooted in Banjar. The projects
            shown here are founder Adjie Rizqan’s work: product workflows, data
            correctness and the interfaces people use.
          </p>
          <nav aria-label="Contact">
            <a href={`mailto:${site.email}`}>Email ↗</a>
            <a href={site.github}>GitHub ↗</a>
            <a href={site.linkedin}>Founder portfolio ↗</a>
          </nav>
        </div>
        <dl>
          {education.map((e) => (
            <div key={e.institution}>
              <dt>{e.institution}</dt>
              <dd>{e.program}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
