import { test } from "node:test";
import assert from "node:assert/strict";
import { fictionalFixtures } from "../scripts/recapture/fixtures.ts";
import { assertCaptureAuthorization } from "../scripts/recapture/guard.ts";
const safe={project:"suhulog",origin:"http://127.0.0.1:5188",sourceRevision:"a".repeat(40),fixtureSeed:fictionalFixtures.seedVersion,isolated:true,externalIntegrationsDisabled:true,ownerImageClearance:true};
test("recapture refuses operational hosts, credentials and missing attestations",()=>{
  assertCaptureAuthorization(safe);
  for(const change of [{origin:"https://jagau.id"},{origin:"http://hospital.example"},{origin:"http://user:pass@127.0.0.1"},{origin:"http://127.0.0.1/private"},{isolated:false},{externalIntegrationsDisabled:false},{ownerImageClearance:false},{sourceRevision:"unverified"}])assert.throws(()=>assertCaptureAuthorization({...safe,...change}));
});
test("fictional fixtures remain coherent and cannot be mistaken for imported records",()=>{
  const p=fictionalFixtures.labstock;assert.equal(p.opening+p.received-p.issued,p.closing);
  assert.ok(fictionalFixtures.people.every(p=>p.id.startsWith("SYN-")&&p.email.endsWith("@example.test")));
  assert.equal(fictionalFixtures.suhulog.readings.length,2);
  assert.match(fictionalFixtures.bdrs.notice,/no real patient/);
});
