/*! Human Origin · streaming SHA-256 · MIT License · https://github.com/spiritracking-arch/human-origin-label-nope-ai */
/* Streaming SHA-256 for Human Origin. Runs entirely in the browser: files are never uploaded. */
(function (g) {
  var K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  function Sha256() {
    this.h = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    this.buf = new Uint8Array(64); this.len = 0; this.total = 0; this.w = new Uint32Array(64);
  }
  Sha256.prototype.block = function (b, o) {
    var w = this.w, h = this.h, i, a, bb, c, d, e, f, gg, hh, t1, t2;
    for (i = 0; i < 16; i++) w[i] = (b[o + 4 * i] << 24) | (b[o + 4 * i + 1] << 16) | (b[o + 4 * i + 2] << 8) | b[o + 4 * i + 3];
    for (i = 16; i < 64; i++) {
      var x = w[i - 15], y = w[i - 2];
      var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    a = h[0]; bb = h[1]; c = h[2]; d = h[3]; e = h[4]; f = h[5]; gg = h[6]; hh = h[7];
    for (i = 0; i < 64; i++) {
      t1 = (hh + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & gg)) + K[i] + w[i]) | 0;
      t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
      hh = gg; gg = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
    }
    h[0] = (h[0] + a) | 0; h[1] = (h[1] + bb) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + gg) | 0; h[7] = (h[7] + hh) | 0;
  };
  Sha256.prototype.update = function (data) {
    var i = 0, n = data.length; this.total += n;
    if (this.len) { while (this.len < 64 && i < n) this.buf[this.len++] = data[i++]; if (this.len === 64) { this.block(this.buf, 0); this.len = 0; } }
    for (; i + 64 <= n; i += 64) this.block(data, i);
    while (i < n) this.buf[this.len++] = data[i++];
    return this;
  };
  Sha256.prototype.hex = function () {
    var bits = this.total * 8, pad = new Uint8Array(((this.len < 56) ? 56 : 120) - this.len + 8);
    pad[0] = 0x80; var hi = Math.floor(bits / 0x100000000), lo = bits >>> 0, L = pad.length;
    pad[L - 8] = hi >>> 24; pad[L - 7] = hi >>> 16; pad[L - 6] = hi >>> 8; pad[L - 5] = hi;
    pad[L - 4] = lo >>> 24; pad[L - 3] = lo >>> 16; pad[L - 2] = lo >>> 8; pad[L - 1] = lo;
    this.update(pad); var out = '';
    for (var i = 0; i < 8; i++) out += ('00000000' + (this.h[i] >>> 0).toString(16)).slice(-8);
    return out;
  };
  /** Hash a File in 4 MB chunks, reporting progress (0..1). */
  g.hoHashFile = function (file, onProgress) {
    var hasher = new Sha256(), size = file.size, pos = 0, CH = 4 * 1024 * 1024;
    return new Promise(function (resolve, reject) {
      function next() {
        if (pos >= size) { if (onProgress) onProgress(1); resolve(hasher.hex()); return; }
        var slice = file.slice(pos, Math.min(pos + CH, size));
        slice.arrayBuffer().then(function (ab) {
          hasher.update(new Uint8Array(ab)); pos += ab.byteLength;
          if (onProgress) onProgress(pos / size);
          setTimeout(next, 0);
        }, reject);
      }
      if (size === 0) resolve(hasher.hex()); else next();
    });
  };
  g.HoSha256 = Sha256;
})(typeof window !== 'undefined' ? window : globalThis);
