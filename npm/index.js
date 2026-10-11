// Verumano client: read-only access to the public verification API.
// Spec: https://lochness-paris.com/verumano/spec/
import { createSha256 } from './sha256.js';

export const DEFAULT_BASE = 'https://lochness-paris.com/verumano';
export const ID_PATTERN = /^(VM|HO)-[0-9]{4}-[0-9]{4,6}$/;
export const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const CHUNK = 4 * 1024 * 1024;

export class VerumanoError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'VerumanoError';
    this.status = status;
    this.body = body;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(path, { base = DEFAULT_BASE, fetch: f = globalThis.fetch, retry = true, signal } = {}) {
  if (typeof f !== 'function') throw new VerumanoError('fetch is not available; pass { fetch } in options', 0);
  const res = await f(base.replace(/\/+$/, '') + path, { headers: { Accept: 'application/json' }, signal });
  if (res.status === 429 && retry) {
    const wait = Math.min(Number(res.headers.get('Retry-After')) || 2, 60);
    await sleep(wait * 1000);
    return request(path, { base, fetch: f, retry: false, signal });
  }
  let body = null;
  try { body = await res.json(); } catch { /* non-JSON body */ }
  if (res.status === 404) return null;
  if (!res.ok) throw new VerumanoError((body && (body.error || body.message)) || `HTTP ${res.status}`, res.status, body);
  return body;
}

/** Public record of a creator, or null when the ID is not registered. */
export async function getCreator(id, options) {
  if (!ID_PATTERN.test(id)) throw new VerumanoError(`Malformed creator ID: ${id}`, 400);
  return request(`/api/v1/creators/${encodeURIComponent(id)}`, options);
}

/** Certified works whose original file has this exact SHA-256 fingerprint. */
export async function findWorks(sha256, options) {
  const h = String(sha256).toLowerCase();
  if (!SHA256_PATTERN.test(h)) throw new VerumanoError('Malformed SHA-256 fingerprint', 400);
  const body = await request(`/api/v1/works?sha256=${h}`, options);
  return body || { sha256: h, matches: [] };
}

/**
 * SHA-256 of a file, computed locally: the file is never sent anywhere.
 * Accepts a browser File/Blob, a Uint8Array/ArrayBuffer, or (Node.js) a file path.
 */
export async function hashFile(input, onProgress) {
  if (typeof input === 'string') {
    const [{ createReadStream }, { createHash }] = await Promise.all([import('node:fs'), import('node:crypto')]);
    const h = createHash('sha256');
    for await (const chunk of createReadStream(input, { highWaterMark: CHUNK })) h.update(chunk);
    return h.digest('hex');
  }
  const hasher = createSha256();
  if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    hasher.update(bytes);
    onProgress?.(1);
    return hasher.hex();
  }
  if (input && typeof input.slice === 'function' && typeof input.size === 'number') {
    for (let off = 0; off < input.size; off += CHUNK) {
      hasher.update(new Uint8Array(await input.slice(off, off + CHUNK).arrayBuffer()));
      onProgress?.(Math.min(1, (off + CHUNK) / input.size));
    }
    if (input.size === 0) onProgress?.(1);
    return hasher.hex();
  }
  throw new VerumanoError('Unsupported input: pass a File, Blob, Uint8Array, ArrayBuffer or file path', 0);
}

/** Hash a file locally and look it up in the registry in one call. */
export async function checkFile(input, options = {}) {
  const sha256 = await hashFile(input, options.onProgress);
  return findWorks(sha256, options);
}

/** Address of a creator's public verification page. */
export function verifyUrl(id, base = DEFAULT_BASE) {
  return `${base.replace(/\/+$/, '')}/verify/${encodeURIComponent(id)}`;
}

export { createSha256 };
