import { createHash, randomBytes } from 'node:crypto';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { createSha256, hashFile, getCreator, findWorks, verifyUrl, VerumanoError } from './index.js';

const ref = (b) => createHash('sha256').update(b).digest('hex');
for (const n of [0, 1, 55, 56, 63, 64, 65, 1000, 100000]) {
  const b = randomBytes(n);
  assert.equal(createSha256().update(b).hex(), ref(b), `len ${n}`);
  const h = createSha256(); for (let i = 0; i < n; i += 7) h.update(b.subarray(i, i + 7));
  assert.equal(h.hex(), ref(b), `chunked len ${n}`);
}
const big = randomBytes(9 * 1024 * 1024 + 3);
assert.equal(await hashFile(new Blob([big])), ref(big), 'Blob');
assert.equal(await hashFile(big), ref(big), 'Uint8Array');
const p = join(tmpdir(), 'vm-test.bin'); writeFileSync(p, big);
assert.equal(await hashFile(p), ref(big), 'path'); unlinkSync(p);

const fake = (status, body) => async () => ({ status, ok: status < 400, headers: new Headers(), json: async () => body });
assert.equal(await getCreator('HO-2026-0001', { fetch: fake(404, {}) }), null);
assert.deepEqual(await getCreator('VM-2026-0002', { fetch: fake(200, { status: 'reviewed' }) }), { status: 'reviewed' });
await assert.rejects(getCreator('XX-1'), VerumanoError);
await assert.rejects(findWorks('abc'), VerumanoError);
await assert.rejects(getCreator('HO-2026-0001', { fetch: fake(500, { error: 'boom' }) }), /boom/);
assert.equal(verifyUrl('HO-2026-0001'), 'https://lochness-paris.com/verumano/verify/HO-2026-0001');
console.log('all tests passed');
