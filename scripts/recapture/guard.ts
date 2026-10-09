import assert from "node:assert/strict";
export type CaptureAuthorization = {
  project:string; origin:string; sourceRevision:string; fixtureSeed:string;
  isolated:boolean; externalIntegrationsDisabled:boolean; ownerImageClearance:boolean;
};
export function assertCaptureAuthorization(value:CaptureAuthorization) {
  assert.ok(["labstock","suhulog","bdrs","elab"].includes(value.project));
  const url=new URL(value.origin);
  assert.ok(["127.0.0.1","localhost","[::1]"].includes(url.hostname),"Capture only an isolated loopback demo; no remote operational host");
  assert.equal(url.protocol,"http:"); assert.equal(url.username,""); assert.equal(url.password,"");
  assert.equal(url.pathname,"/"); assert.equal(url.search,"");
  assert.match(value.sourceRevision,/^[a-f0-9]{40}$/);
  assert.equal(value.fixtureSeed,"jagau-fictional-id-v1");
  assert.equal(value.isolated,true); assert.equal(value.externalIntegrationsDisabled,true);
  assert.equal(value.ownerImageClearance,true,"Actual application image clearance is required");
}
