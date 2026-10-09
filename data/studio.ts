import { publicKnowledge } from "./public-knowledge.ts";
export const studio = {
  name: "JAGAU",
  email: "adjie@jagau.id",
  origin: "https://jagau.id",
  founder: "Adjie Rizqan",
  portfolio: "https://adjierizqan.github.io/",
  proposition: "Real systems. Thoughtfully engineered.",
  positioning:
    "An independent software studio in Indonesia. Rooted in Banjar. Building software for the real world.",
} as const;

// Derived from reviewed workspace records; retrieval and case studies share the same facts.
export const projects = publicKnowledge.map(project => ({
  ...project, title: project.name,
  decision: [...project.decisions.map(item => item.detail), ...project.howItWorks].join(" "),
}));
export type ProjectId = (typeof projects)[number]["id"];

export const topics = [
  {
    id: "work",
    label: "What has JAGAU built?",
    title: "Software with a real operational job.",
    answer:
      "Explore the founder’s work in laboratory inventory, temperature monitoring and blood-bank workflows. These case studies show the engineering behind the interface: traceable records, explicit states and reports connected to their source.",
    projectIds: ["labstock", "suhulog", "bdrs"],
  },
  {
    id: "reliability",
    label: "How do you build reliable operational software?",
    title: "Make the record trustworthy.",
    answer:
      "Start with the actual workflow and the meaning of each record. Preserve correction history. Enforce important rules on the server. Verify the output people use, and plan recovery before release. LabStock’s source ledger and SuhuLog’s correction history show this approach in practice.",
    projectIds: ["labstock", "suhulog"],
  },
  {
    id: "story",
    label: "What does JAGAU mean?",
    title: "Rooted in Banjar. Grounded in the work.",
    answer:
      "JAGAU is an independent software practice founded by Adjie Rizqan in Indonesia. The name reflects its Banjar roots. Here, that identity is expressed through care for the work: understanding real processes and building systems people can inspect and maintain.",
    projectIds: [],
  },
  {
    id: "contact",
    label: "Discuss a project",
    title: "Start with the problem you want to solve.",
    answer:
      "Tell Adjie about your current workflow, where it breaks down and what a useful outcome would look like. Get in touch at adjie@jagau.id to discuss fit, scope and the next step. Pricing, availability and delivery dates are agreed directly, rather than inferred here.",
    projectIds: [],
  },
] as const;
export type TopicId = (typeof topics)[number]["id"];
