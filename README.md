# Human Origin Specification

Open specification of the **Human Origin** label for human-made creative work: identifiers, statuses, review requirements, verification pages, badges, work fingerprints, revocation, privacy and third-party conformance.

- **Current version:** v0.2 (working draft), [read it here](spec/human-origin-specification.md) or [online](https://human-origin-label.lochness-paris.com/spec/)
- **Companion paper:** [doi:10.5281/zenodo.23049397](https://doi.org/10.5281/zenodo.23049397)
- **Pilot:** [human-origin-label.lochness-paris.com](https://human-origin-label.lochness-paris.com/)

## What Human Origin is

Human Origin reviews **how** a work was made rather than what the finished work looks like. A human reviewer examines evidence of the creative process (live on a video call, or through a screen recording containing a one-time code) and records what was seen on a public, numbered verification page. A **reviewed** badge (green) attests that this review took place; a **self-declared** badge (orange) is a commitment nobody checked; a **revoked** badge (red) is no longer valid.

Individual works can be certified by the SHA-256 fingerprint of their original file, computed on the user's device: files are never uploaded.

The label never claims that no AI tool was used at any point. It records a review, and says so.

## Repository contents

| Path | Content | Licence |
| --- | --- | --- |
| [`spec/`](spec/) | The specification, versioned | CC BY 4.0 |
| [`charter/`](charter/) | The Creator Charter (rules on AI use, per discipline) | CC BY 4.0 |
| [`schemas/`](schemas/) | JSON Schemas for the API responses | MIT |
| [`lib/`](lib/) | `sha256.js`: streaming SHA-256 for fingerprinting files in the browser | MIT |
| [`examples/`](examples/) | Badge embed codes, a file checker page, command-line check | MIT |

## Verify a file in 30 seconds

```bash
# 1. Fingerprint the original file locally
sha256sum my-file.png
# 2. Ask the public API whether it matches a certified work
curl "https://human-origin-label.lochness-paris.com/api/v1/works?sha256=<64-character fingerprint>"
```

Or open [`examples/verify-file.html`](examples/verify-file.html) in a browser.

## Public API

Read-only, no key, CORS open, 60 requests per minute. Documentation: [human-origin-label.lochness-paris.com/api/](https://human-origin-label.lochness-paris.com/api/)

| Endpoint | Returns |
| --- | --- |
| `GET /api/v1/creators/{creator ID}` | Status and public record of a creator |
| `GET /api/v1/works?sha256={fingerprint}` | Certified works matching a file fingerprint |

JSON Schemas for both responses are in [`schemas/`](schemas/).

## Contributing

Proposals and corrections are welcome as issues. See [CONTRIBUTING.md](CONTRIBUTING.md) for how changes to the specification are decided and versioned.

## Citing

See [CITATION.cff](CITATION.cff). Each release is archived on Zenodo with its own DOI.

## Governance and disclosure

The specification is edited by Camille Guerineau ([ORCID 0009-0009-0364-6396](https://orcid.org/0009-0009-0364-6396)), who operates Human Origin and founded Loch Ness. Contact: contact@lochness-paris.com.
