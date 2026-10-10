"use client";
import type { ReactNode } from "react";
import { EvidenceStage } from "@/components/showcase/EvidenceStage";
import Image from "next/image";
import { featuredWork, allWorkspaceProjects, type WorkspaceProject } from "@/data/workspace";
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
  guideConfigured = false,
}: {
  selectProject: (p: WorkspaceProject) => void;
  openAsk: () => void;
  composer: ReactNode;
  busy?: boolean;
  guideConfigured?: boolean;
  askQuestion: (question: string) => void;
}) {
  return (
    <main className="aw-center workspace-home aw-enter">
      <header className="home-intro">
        <div className="home-identity">
          <div><h1>{identity.name}</h1><p>Independent software studio · Indonesia</p></div>

        </div>
        <section className="home-start" aria-label="Explore JAGAU">
          <div className="home-conversation">
          <h2>Software with<br/><em>a memory.</em></h2>
          <p className="home-positioning">From a stock movement to a corrected reading, the record matters. Explore the software and the decisions behind it. {guideConfigured ? "Optional AI with reviewed sources; curated fallback available." : "Curated answers · no live AI."}</p>
          <div className="home-guide">
            {composer}
          <div className="home-starters" aria-label="Suggested questions">
            {[
              ["Start with the work", "What has JAGAU built?"],
              ["How we build", "How do you build reliable operational software?"],
              ["About JAGAU", "What does JAGAU mean?"],
            ].map(([label, question]) => <button key={label} type="button" disabled={busy} onClick={() => askQuestion(question)}>{label} <span aria-hidden="true">↗</span></button>)}
          </div>
          </div>
          </div>
          <EvidenceStage onAsk={askQuestion} onOpen={selectProject}/>
          <nav className="home-intro-actions" aria-label="Introduction actions">
            <a href="#home-work" onClick={navigateToSection}>Explore the work ↓</a>

          </nav>
        </section>
      </header>
      <section className="home-selected" aria-labelledby="home-work">
        <header>
          <h2 id="home-work" tabIndex={-1}>Selected work</h2>
          <span>From the source record to the working interface</span>
        </header>
        <div className="home-work-list">
          {featuredWork.map((p, i) => (
            <a
              href={`/projects/${p.slug}/`}
              key={p.slug}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                selectProject(p);
              }}
              className={`home-project home-project-${i}`}
            >
              <figure>
                <Image
                  src={p.thumb ?? p.image ?? ""}
                  alt={p.title + " · approved public project screenshot"}
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
          <h2>Inspect the decisions behind the screen.</h2>
          <p>Ask about the architecture, decisions or evidence.</p>
        </div>
        <button type="button" onClick={openAsk}>
          Open JAGAU Guide ↗
        </button>
      </section>
      <StudioAbout />
    </main>
  );
}

export function StudioAbout() {
  return (
      <section className="home-about">
        <div>
          <h2>Built around the working record.</h2>
          <p>
            JAGAU is an independent software practice rooted in Banjar. The projects
            shown here are founder Adjie Rizqan’s work: laboratory inventory, temperature
            monitoring, blood-bank workflows and document management.
          </p>
          <details className="studio-language"><summary lang="id">Ringkasan Bahasa Indonesia</summary><p lang="id">JAGAU adalah studio perangkat lunak independen yang berakar pada budaya Banjar. Proyek di sini merupakan karya pendirinya, Adjie Rizqan: inventaris laboratorium, pemantauan suhu, alur kerja bank darah dan pengelolaan dokumen. Setiap studi kasus menjelaskan bukti implementasi serta batas verifikasinya.</p></details>
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
  );
}

export function StudioPresentation({ selectProject }: { selectProject: (project: WorkspaceProject) => void }) {
  return <>

    <section className="studio-approach" aria-labelledby="studio-approach-title">
      <div className="studio-principle"><span>01 / The practice</span><h2 id="studio-approach-title">Interfaces are the visible part.<br/><em>The record is the foundation.</em></h2><p>Three systems. Three ways of preserving what happened.</p></div>
      <ol>
        <li><span>01 / LabStock</span><h3>Keep stock connected to its source.</h3><p>LabStock carries workbook, sheet and row identity into the ledger, reports and Excel exports.</p></li>
        <li><span>02 / SuhuLog</span><h3>Correct a reading without erasing it.</h3><p>SuhuLog keeps the previous value when a correction becomes effective. Monitoring and exports use those same records.</p></li>
        <li><span>03 / BDRS</span><h3>Give each event its own meaning.</h3><p>BDRS separates request, crossmatch, issue and physical outcome. A single status does not stand in for the entire case.</p></li>
      </ol>
    </section>
    <section className="studio-systems" aria-labelledby="studio-systems-title">
      <h2 id="studio-systems-title">See the approach in the work</h2>
      <p>Founder projects, with their current status and public evidence.</p>
      <div>{allWorkspaceProjects.map(project => <a key={project.slug} href={`/projects/${project.slug}/`} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); selectProject(project); }}>
        <div><h3>{project.title}<span aria-hidden="true">↗</span></h3><p>{project.summary}</p></div>
        <small>{project.status}</small>
      </a>)}</div>
    </section>
  </>;
}
