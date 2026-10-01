# sha256.js

Streaming SHA-256 for the browser, used by Human Origin to fingerprint files **without uploading them**.
No dependencies. Tested against Node's `crypto` on inputs from 0 bytes to 5 MB fed in random chunks.

```html
<script src="sha256.js"></script>
<script>
  // file: a File from <input type="file"> or a drop event
  hoHashFile(file, p => console.log(Math.round(p * 100) + '%'))
    .then(hash => console.log(hash)); // 64 lowercase hex characters
</script>
```

- `hoHashFile(file, onProgress)` reads the file in 4 MB chunks and resolves to the hex digest.
- `new HoSha256().update(uint8array).hex()` for incremental use.

Why not `crypto.subtle.digest`? It needs the whole file in memory at once, which fails on large videos.
