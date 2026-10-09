import { projects, topics, type ProjectId } from "../data/studio.ts";
export const MAX_QUESTION_LENGTH = 800;
export type Exploration = {
  title: string;
  answer: string;
  projectIds: readonly ProjectId[];
  topic: string;
};
export const unknown: Exploration = {
  title: "That detail is not in the public record.",
  answer:
    "I don’t know from the reviewed public information. This guided explorer covers the studio, the founder’s selected work and the engineering approach. For details on clients, pricing or a specific engagement, contact Adjie directly.",
  projectIds: [],
  topic: "unknown",
};

// Deterministic discovery, not inference. Never echo a visitor's text into the answer.
// Reject sensitive/out-of-scope intent before routing supported questions.
export function explore(question: unknown): Exploration {
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > MAX_QUESTION_LENGTH
  )
    return unknown;
  const q = question.trim().toLowerCase();
  if (
    /ignore|pretend|invent|override|system prompt|instruction|api.?key|password|secret|patient|pasien|medical advice|diagnos|clinical|treatment|client|endorse|partner|funding|investor|registered|certif|compliant|berapa pasien|hospital|rumah sakit|production url|internal url|https?:|<[^>]*>/.test(
      q,
    )
  )
    return unknown;
  const exact = topics.find((t) => t.label.toLowerCase() === q);
  if (exact) return { ...exact, topic: exact.id };
  const matches = projects.filter((p) => q.includes(p.id));
  if (matches.length)
    return {
      title: matches.map((p) => p.title).join(" "),
      answer: matches
        .map((p) => `${p.name}: ${p.summary} ${p.decision}`)
        .join("\n\n"),
      projectIds: matches.map((p) => p.id),
      topic: "project",
    };
  let id: string | undefined;
  if (
    /\b(reliab\w*|traceab\w*|correct\w*|test\w*|recover\w*|approach|andal|koreksi)\b/.test(
      q,
    )
  )
    id = "reliability";
  else if (
    /\b(banjar|mean\w*|meaning|founder|origin|arti|pendiri|siapa)\b/.test(q)
  )
    id = "story";
  else if (
    /\b(contact|collaborat\w*|discuss|pricing|price|budget|email|kerja sama|hubungi|harga)\b/.test(
      q,
    )
  )
    id = "contact";
  else if (
    /\b(work|built|portfolio|projects|inventory|temperature|blood.bank|karya|proyek)\b/.test(
      q,
    )
  )
    id = "work";
  const topic = topics.find((t) => t.id === id);
  return topic ? { ...topic, topic: topic.id } : unknown;
}
