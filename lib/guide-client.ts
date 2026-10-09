import { readBoundedBody } from "./bounded-body.ts";
import { explore, MAX_QUESTION_LENGTH } from "./explorer.ts";
import { KNOWLEDGE_VERSION } from "../data/public-knowledge.ts";
import { unsafeQuestion, validateReply, type GuideReply } from "./guide-protocol.ts";
export const guideEndpoint=process.env.NEXT_PUBLIC_JAGAU_GUIDE_ENDPOINT ?? "";
export function curatedReply(question:string,reason="offline"):GuideReply {
  const record=explore(question);return {mode:"curated",answer:record.answer,projectIds:[...record.projectIds],knowledgeVersion:KNOWLEDGE_VERSION,reason};
}
export async function requestGuide(question:string,projectId:string|null,signal:AbortSignal,endpoint=guideEndpoint,transport:typeof fetch=fetch):Promise<GuideReply> {
  if(!question.trim()||question.length>MAX_QUESTION_LENGTH)throw Error("INVALID_QUESTION");
  if(!endpoint||unsafeQuestion(question))return curatedReply(question,unsafeQuestion(question)?"sensitive":"offline");
  let url:URL;
  try { url=new URL(endpoint); } catch { return curatedReply(question,"configuration"); }
  if(url.protocol!=="https:"||url.username||url.password||url.pathname!=="/ask"||url.search||url.hash)return curatedReply(question,"configuration");
  const timer=new AbortController();const timeout=setTimeout(()=>timer.abort(),12000);
  try {
    const result=await transport(url.href,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,projectId}),credentials:"omit",cache:"no-store",signal:AbortSignal.any([signal,timer.signal])});
    if(!result.ok)return curatedReply(question,"unavailable");
    const body=await readBoundedBody(result.body,10000,AbortSignal.any([signal,timer.signal]));
    return validateReply(JSON.parse(body));
  } catch {if(signal.aborted)throw new DOMException("Stopped","AbortError");return curatedReply(question,timer.signal.aborted?"timeout":"unavailable");}
  finally {clearTimeout(timeout);}
}
