import { publicKnowledge, KNOWLEDGE_VERSION } from "../data/public-knowledge.ts";
export const MAX_OUTPUT_LENGTH=1600;
export type GuideReply={mode:"ai"|"curated";answer:string;projectIds:string[];knowledgeVersion:string;reason?:string};
// Guard high-risk requests before transmitting any visitor text to a provider.
export function unsafeQuestion(question:string) {
  return /ignore.{0,30}instruction|system.?prompt|api.?key|password|secret|patient|pasien|medical advice|diagnos|treatment|registered company|certif|https?:|<[^>]*>|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(question);
}
export function validateReply(value:unknown):GuideReply {
  const x=value as Partial<GuideReply>;
  if(!x||x.mode!=="ai"||typeof x.answer!=="string"||!x.answer.trim()||x.answer.length>MAX_OUTPUT_LENGTH||x.knowledgeVersion!==KNOWLEDGE_VERSION||!Array.isArray(x.projectIds)||x.projectIds.length===0)throw Error("INVALID_GUIDE_REPLY");
  if(/https?:|<[^>]*>|api.?key|patient name|nama pasien|sk-[\w-]{16,}|gh[pousr]_[\w]{20,}/i.test(x.answer))throw Error("UNSAFE_GUIDE_REPLY");
  if(x.projectIds.some(id=>!publicKnowledge.some(p=>p.id===id)))throw Error("INVALID_GUIDE_REFERENCE");
  return {mode:"ai",answer:x.answer,projectIds:[...new Set(x.projectIds)],knowledgeVersion:KNOWLEDGE_VERSION};
}
