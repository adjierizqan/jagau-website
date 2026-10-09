import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { join } from 'node:path';

// RC A must retain the exact existing public image set and use local curated answers.
const inventory = JSON.parse(readFileSync('docs/screenshots/inventory.json', 'utf8'));
const expected = new Set(inventory.assets.map(asset => asset.file));
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
}
const actual = files('public/projects').filter(path => /\.(png|jpe?g|webp|gif|avif)$/i.test(path));
assert.deepEqual(new Set(actual), expected, 'RC A image set changed: require exact-payload clearance first');
for (const asset of inventory.assets) {
  assert.equal(createHash('sha256').update(readFileSync(asset.file)).digest('hex'), asset.originalSha256, asset.file);
}
assert.equal(process.env.NEXT_PUBLIC_JAGAU_GUIDE_ENDPOINT ?? '', '', 'RC A must use curated Guide');
const worker = readFileSync('cloudflare/guide-worker/wrangler.jsonc', 'utf8');
assert.match(worker, /"ENABLED"\s*:\s*"false"/);
assert.match(worker, /"OWNER_APPROVED_FREE_PLAN"\s*:\s*"false"/);
console.log(`PASS: RC A retains ${actual.length} exact images; curated endpoint and disabled Worker`);
