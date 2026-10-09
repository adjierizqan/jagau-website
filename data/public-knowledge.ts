import { allWorkspaceProjects } from "./workspace.ts";
// Derived public allowlist. Workspace records remain the only editable project truth.
export const KNOWLEDGE_VERSION = "2026-10-09.2";
export const publicKnowledge = allWorkspaceProjects.map(project => ({
  id: project.slug, name: project.title, summary: project.summary,
  status: project.status ?? "Public source record", problem: project.problem,
  solution: project.solution, decisions: project.decisions ?? project.presentation?.decisions ?? [],
  howItWorks: project.howItWorks, stack: project.stack,
  evidence: project.evidence, limitations: project.publicLimitations,
  url: `https://jagau.id/projects/${project.slug}/`,
}));
