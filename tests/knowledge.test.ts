import { test } from "node:test";
import assert from "node:assert/strict";
import { publicKnowledge, KNOWLEDGE_VERSION } from "../data/public-knowledge.ts";
import { allWorkspaceProjects } from "../data/workspace.ts";
import { projects } from "../data/studio.ts";
import { explore } from "../lib/explorer.ts";
test("shared knowledge is versioned, unique and derived from case records", () => {
  assert.ok(KNOWLEDGE_VERSION);
  assert.equal(new Set(publicKnowledge.map(p=>p.id)).size, publicKnowledge.length);
  for (const p of allWorkspaceProjects) {
    const k=publicKnowledge.find(k=>k.id===p.slug)!;
    assert.equal(k.summary,p.summary); assert.equal(k.status,p.status ?? "Public source record");
    assert.equal(projects.find(k=>k.id===p.slug)?.summary,p.summary);
    assert.equal(k.url,`https://jagau.id/projects/${p.slug}/`);
  }
});
test("ELAB is discoverable without fabricating release, image or clinical claims", () => {
  const p=allWorkspaceProjects.find(p=>p.slug==="elab")!;
  assert.match(p.status!,/In progress/); assert.equal(p.image,undefined);
  assert.match(p.publicLimitations,/not a production/);
  assert.deepEqual(explore("What is ELAB?").projectIds,["elab"]);
});
