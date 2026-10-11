# verumano

Verify [Verumano](https://lochness-paris.com/verumano/) human-made badges and file fingerprints from JavaScript.

- Read-only client for the public verification API (no key needed)
- SHA-256 fingerprints computed **locally**: files are never uploaded
- A `<verumano-badge>` web component that shows the live official badge
- Zero dependencies, browser and Node.js 18+, TypeScript types included

```bash
npm i verumano
```

## Check a creator

```js
import { getCreator } from 'verumano';

const record = await getCreator('HO-2026-0001');
if (!record) console.log('Not registered');
else console.log(record.creator.status); // "reviewed" or "revoked"
```

`getCreator` returns `null` for an unknown ID and throws a `VerumanoError` for a malformed one.

## Check a file

```js
import { checkFile } from 'verumano';

// Browser: a File from <input type="file"> or drag and drop
// Node.js: a file path
const result = await checkFile(file, { onProgress: (p) => console.log(Math.round(p * 100) + '%') });

if (result.matches.length === 0) console.log('This exact file is not registered');
for (const m of result.matches) console.log(m.creator_id, m.title, m.status);
```

The file is read in 4 MB chunks and hashed on the device. Only the 64-character fingerprint is sent.
A fingerprint identifies exact bytes: a re-exported, resized or recompressed file will not match.
A match on a `revoked` record is not a certification.

You can also call the steps separately: `hashFile(file)` then `findWorks(sha256)`.

## Show a badge

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/verumano@0.1.0/badge.js"></script>

<verumano-badge creator="HO-2026-0001" discipline="illustration"></verumano-badge>
<verumano-badge creator="HO-2026-0001" discipline="illustration" theme="dark" size="s"></verumano-badge>
```

Or with a bundler: `import 'verumano/badge';`

The image is rendered by the label at display time, so a revoked badge shows as revoked everywhere within the hour.
It links to the creator's public verification page. Attributes: `creator`, `discipline`
(`writing`, `illustration`, `photography`, `music`, `video`), `theme` (`light`, `dark`), `size` (`l`, `m`, `s`).

## Options

Every network call accepts `{ base, fetch, retry, signal }`:

| Option | Default | Use |
| --- | --- | --- |
| `base` | `https://lochness-paris.com/verumano` | Another conforming registry |
| `fetch` | `globalThis.fetch` | A custom fetch |
| `retry` | `true` | Wait and retry once after HTTP 429 |
| `signal` | none | Cancel with an `AbortController` |

The public API allows 60 requests per minute.

## Displaying a status on your platform

If you show Verumano statuses, the [specification](https://lochness-paris.com/verumano/spec/) (section 13) asks you to:

1. Fetch the status at display time, not from an old copy
2. Never show `declared` as reviewed
3. Link to the verification page wherever a reviewed status is shown
4. Report a file match on a revoked record as revoked
5. Not alter the badges or claim more than the stated scope

The label does not prove that no AI was used. It certifies that a human creative process was shown and examined.

## Links

- [API documentation](https://lochness-paris.com/verumano/api/)
- [Specification](https://lochness-paris.com/verumano/spec/) · [Zenodo, doi:10.5281/zenodo.23072758](https://doi.org/10.5281/zenodo.23072758)
- [Source](https://github.com/spiritracking-arch/human-origin-label-nope-ai/tree/main/npm)

MIT © Camille Guerineau
