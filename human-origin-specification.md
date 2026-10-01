# Human Origin Specification v0.2

Working draft · 30 September 2026 · Edited by Camille Guerineau (ORCID 0009-0009-0364-6396)

## Status of this document

This is a working draft (v0.2) of the Human Origin Specification. It describes how the Human Origin label identifies creators, what each status means, how reviews are carried out, and how anyone can verify a badge or a file. It reflects the pilot implementation at [human-origin-label.lochness-paris.com](https://human-origin-label.lochness-paris.com/). The concept, method and pilot design are described in a companion paper: [doi:10.5281/zenodo.23049397](https://doi.org/10.5281/zenodo.23049397).

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in RFC 2119. Items marked **(planned)** describe features that are not yet available. This text is released under the Creative Commons Attribution 4.0 International licence (CC BY 4.0).

## 1. Purpose and scope

A Human Origin **reviewed** badge attests that an independent reviewer examined evidence of the creative process for the works it covers, on a stated date, by a stated method. A **self-declared** badge attests only that the creator committed to the Creator Charter; nobody checked it.

The label MUST NOT be presented as proof that no AI tool was used at any point, as a certification within the meaning of any consumer law, or as covering works beyond the scope stated on the verification page.

This specification covers five disciplines: writing, illustration, photography, music and video.

## 2. Terminology

| Term | Definition |
| --- | --- |
| Creator | A person whose creative process is reviewed and who displays a badge |
| Reviewer | A person acting for the label who examines process evidence and records a decision |
| Registry | The authoritative list of creator records, their statuses and certified works |
| Creator record | The entry for one creator, identified by a creator ID |
| Verification page | The public page that displays a creator record |
| Badge | An image served by the label that shows a status and links to a verification page or the programme page |
| Watermark | A transparent mark placed on a creator's images or videos, bearing the creator ID |
| Work | A single creative output covered by a review |
| Fingerprint | The SHA-256 digest of the exact bytes of a work's original file |
| Scope | The works or channels a review covers, stated on the verification page |
| Creator Charter | The rules on AI use that creators commit to, per discipline |

## 3. Identifiers

Each reviewed creator receives one creator ID of the form `HO-YYYY-NNNN`, for example `HO-2026-0001`.

- `HO` is the fixed prefix. `YYYY` is the year of the series. `NNNN` is a sequence number of at least four digits, zero-padded; it MAY grow to six digits.
- The pattern is `^HO-[0-9]{4}-[0-9]{4,6}$`. Implementations MUST treat IDs as case-sensitive strings and MUST NOT infer anything from the sequence number beyond order of issue.
- An ID MUST be unique and MUST NOT be reassigned, including after revocation or deletion of the record.
- One creator ID covers all disciplines listed in the record. Self-declared badges carry no ID.

The verification page of a creator is found at `{site}/verify/{creator ID}`.

## 4. Statuses

A badge shows exactly one status. The set is closed: implementations MUST NOT display any other.

| Status | Colour | Meaning | Carries an ID |
| --- | --- | --- | --- |
| `reviewed` | Green | A reviewer examined the creator's process for the stated scope | Yes |
| `declared` | Orange | The creator committed to the Charter; not checked | No |
| `revoked` | Red | A reviewed badge was withdrawn, or any badge is displayed on a blocked website | Yes, when it was reviewed |
| `demo` | Green or red, with a notice | A fictional record used to illustrate the system; its page says so and is excluded from search engines | Yes |
| `expired` (planned) | To be defined | The review is older than its validity period and awaits renewal | Yes |

Allowed transitions: `reviewed` → `revoked` (Section 10); `revoked` → `reviewed` only after a new decision recorded on the page; a creator with a `declared` badge MAY apply and become `reviewed`, which requires replacing the badge code.

## 5. Review requirements

A `reviewed` status MUST rest on evidence of the creative process, examined by a person. An automated detector score MUST NOT be the basis of a decision.

**Review modes.** A review MUST use one of these modes, and the mode MUST be published on the verification page:

1. **Live walkthrough**: the creator shares their screen on a video call and opens their files. Nothing is recorded or retained.
2. **Screen recording with one-time code**: the reviewer sends a code (for example `HO-7K2P`) just before recording; the code MUST appear in the recording. Recordings MUST be sent through an end-to-end encrypted channel with disappearing messages, or an expiring link, and MUST be deleted within 7 days of the decision.

**Evidence by discipline.** The reviewer SHOULD examine evidence of the following kinds:

| Discipline | Evidence |
| --- | --- |
| Writing | Document version history, drafts, outlines, notes |
| Illustration | Layered source files, sketches, timelapse recordings |
| Photography | RAW files with EXIF data, contact sheets |
| Music | DAW project files, stems, raw recordings |
| Video | Raw footage, editing project files |

**Decision and consent.** Before a record is published, the creator MUST accept the Creator Charter in writing and agree to publication of their verification page; the reviewer records the acceptance date. The reviewer MUST record the scope, the method and a short description of the evidence seen. Declined applicants MAY use the self-declared badge.

## 6. Verification page

Every creator ID MUST resolve to a public verification page. An unknown ID MUST return HTTP 404 with a lookup form.

| Field | Required | Notes |
| --- | --- | --- |
| Status | Yes | With the revocation date when revoked |
| Creator ID | Yes | As in Section 3 |
| Official badge | Yes | Rendered by the label, for visual comparison with badges seen elsewhere |
| Creator name | Yes | Name or professional name |
| Disciplines | Yes | One or more of the five |
| Website | Yes | The only website where the badge may be displayed, with the accounts below |
| Official accounts | No | Social accounts where the badge or watermark may appear |
| Scope (work covered) | Yes | What the review covers |
| Review date | Yes | ISO 8601 date |
| Review method | Yes | One of the modes in Section 5 |
| Evidence examined | Yes | A short list, no files |
| Certified works | No | Title, date and fingerprint per work (Section 8) |
| Charter version | Yes | The version the creator accepted |
| What the badge means | Yes | Including that it does not prove absence of AI |

Outbound links from the page to the creator's website and accounts SHOULD carry `rel="nofollow noopener"`. A `revoked` page MUST remain public and state the status clearly. A `demo` page MUST display a notice that the record is fictional and MUST carry `noindex`.

## 7. Badges

**Semantics.** Colour, icon and words MUST agree: green with a check mark and “Process reviewed”, orange with a dotted circle and “Self-declared”, red with a cross and “Badge revoked”. Status MUST NOT be conveyed by colour alone.

**Formats.** Badges are SVG images served by the label.

| Format | Sizes (px) | Available for |
| --- | --- | --- |
| Horizontal badge | 380 × 112 (l), 300 × 88 (m), 230 × 48 (s) | Reviewed, declared |
| Round seal | 160, 112, 72 | Reviewed, declared |
| Watermark | 360 × 80, 270 × 60, 180 × 40 | Reviewed only |

**URL scheme.** `{site}/badges/{format}-{discipline}-{level}-{theme}[-{number}][-{size}].svg`, where format is `badge`, `seal` or `watermark`; discipline is `writing`, `illustration`, `photography`, `music` or `video`; level is `reviewed` or `declared`; theme is `light` or `dark`; number is the sequence part of the creator ID (reviewed only); size is `s`, `m` or omitted for large.

- A reviewed badge MUST only be served for a registered ID and a discipline listed in its record; otherwise the server MUST return 404.
- A reviewed badge links to the creator's verification page; a declared badge links to the programme page.
- The creator ID MUST remain legible. Badges and watermarks MUST NOT be altered, cropped or recoloured.
- Badges MAY be displayed on the creator's listed website and accounts only, next to covered works, or site-wide when all published work is covered.

## 8. Work fingerprints

A certified work is identified by the SHA-256 digest of the exact bytes of its original file, written as 64 lowercase hexadecimal characters. Any change to the file, including recompression, resizing or metadata removal, produces a different fingerprint.

**Computation.** Fingerprints MUST be computed on the user's device. A creator submitting a fingerprint and a person checking a file MUST NOT be required to upload the file. The reference implementation computes SHA-256 in the browser, reading the file in 4 MB chunks.

**Record.** Each work in a creator record holds:

```json
{"hash": "8f7ae72c2bf7e906038ff4b532f2d27d1f68cb429ada547d4a8781309cd02a3b", "title": "The fox, ink and watercolor", "date": "2026-09-15"}
```

- A fingerprint MUST only be recorded for a work within the reviewed scope, and SHOULD be the final version.
- A match proves that a file is byte-identical to the certified work. It does not extend the scope of the review.
- Checking MUST be available on the creator's verification page and on a registry-wide page (`{site}/fingerprint/`).
- A match on a `revoked` record MUST be reported as revoked, not as certified.

Fingerprints MAY additionally be timestamped with an independent service such as OpenTimestamps (planned).

## 9. Verification API

A read-only, public JSON API lets platforms verify creators and files without scraping pages. It requires no key, is open to other origins (CORS) and is documented at `{site}/api/`.

| Method and path | Returns |
| --- | --- |
| `GET /api/v1/creators/{creator ID}` | The public fields of a creator record (Section 6) and its status, `reviewed` or `revoked` |
| `GET /api/v1/works?sha256={fingerprint}` | Every certified work matching the fingerprint, with its creator ID and status |

Example response for a fingerprint lookup:

```json
{"api_version": "1", "sha256": "8f7a…2a3b", "matches": [{"creator_id": "HO-2026-0001", "creator": "Nora Lindqvist (demo)", "title": "The fox, ink and watercolor", "date": "2026-09-15", "status": "reviewed", "demo": true, "url": "{site}/verify/HO-2026-0001"}]}
```

- The API MUST expose only fields shown on public verification pages.
- Responses MAY be cached for up to 5 minutes and MUST NOT be cached for more than one hour, so that revocations propagate.
- A malformed ID or fingerprint MUST return HTTP 400; an unknown ID MUST return HTTP 404; any method other than GET or HEAD MUST return HTTP 405; a client exceeding the rate limit (60 requests per minute in the reference implementation) receives HTTP 429.
- Rate limiting MUST NOT store client addresses in clear; the reference implementation keeps a salted, daily-rotated hash for one minute.
- The earlier lookup `{site}/fingerprint/?check={sha256}` remains available for compatibility; it reports the status as `active` instead of `reviewed`.

## 10. Revocation and blocking

A reviewed badge MAY be revoked when the work covered includes AI-generated content, when evidence shown during the review was not genuine, or when the badge is displayed on someone else's work.

1. Except in cases of obvious fraud, the creator MUST be notified by email and given 14 days to explain or correct the situation.
2. On revocation, the verification page MUST show the status and date, and every badge served for that ID MUST render as revoked.
3. Badge images MUST be served with a cache lifetime of at most one hour, so that revocation is visible everywhere within that time.
4. Revocation MAY be reversed only by a new decision recorded on the page.

**Blocking.** Self-declared badges carry no ID, so they are revoked per website: when a domain is blocked, every badge requested from that domain or its subdomains MUST render as revoked, whatever its level. Blocking relies on the HTTP Referer header and is therefore partial (Section 12).

Images already exported (PNG files, embedded watermarks) cannot be changed remotely; for them the verification page is authoritative.

## 11. Privacy requirements

The label collects only what it publishes or needs to decide.

| Data | Retention |
| --- | --- |
| Creators' original files | Never collected |
| Screen recordings sent for review | Deleted within 7 days of the decision |
| Creator record and verification page | While the badge exists; up to 24 months after revocation |
| Work fingerprints | While the badge exists |
| Badge display records (domain, page address) | 24 months after last seen; no IP address or visitor data |
| Unanswered applications | 12 months |

- Files checked by the public MUST be fingerprinted locally and MUST NOT be transmitted.
- Search engines and social networks MUST NOT be recorded as sites displaying badges.
- A creator MAY ask at any time for their record to be deleted; their badges then stop working.
- Publication of a verification page requires the creator's consent (Section 5).

## 12. Security considerations and limitations

| Threat or limit | Effect | Mitigation |
| --- | --- | --- |
| Copying a genuine badge to another site | The badge appears on unrelated work | Verification page lists the only allowed website and accounts; display monitoring alerts the reviewer; domain blocking |
| Reusing a badge on a generated image | A work appears certified | Work fingerprints: the image does not match any certified work |
| Staged process | A fabricated process passes review | Live review, one-time codes, consistency across several works; cannot be eliminated |
| Hidden referrer or cached images | Monitoring and blocking miss some displays | Treated as a lower bound; the verification page stays authoritative |
| Exported PNGs and watermarks | Cannot be revoked remotely | Verification page shows the current status |
| Ephemeral channels | Recipients can still capture content | Commitment is deletion within 7 days, not technical impossibility |
| Single reviewer (pilot) | Limited throughput; reviewer error | Planned second reviewer for borderline cases, published statistics, appeal procedure |

No part of the system can prove that a work was made without any AI assistance. Implementations MUST NOT claim otherwise.

## 13. Conformance for third parties

A platform, gallery, marketplace or competition that displays Human Origin status for a creator or a file is a conforming integration when it:

1. Obtains the status from the label at display time (verification page or API), not from a copy stored earlier;
2. Shows the status with the same meaning as Section 4, and never shows `declared` as reviewed;
3. Links to the creator's verification page wherever a reviewed status is shown;
4. For files, compares fingerprints computed on the user's device and reports a match on a revoked record as revoked;
5. Does not alter the label's badges or imply that the label certifies more than the stated scope.

Only conforming integrations MAY describe themselves as “Human Origin verified”.

## 14. Governance, versioning and change log

The specification is edited by the operator of Human Origin, Camille G. (ORCID 0009-0009-0364-6396), who is also the founder of Loch Ness. Proposals and corrections can be sent to contact@lochness-paris.com.

- Versions follow MAJOR.MINOR. A MINOR version adds or clarifies without changing the meaning of existing statuses or identifiers; a MAJOR version may change them.
- Each published version is frozen and deposited on Zenodo with its own DOI. The current version is published at `{site}/spec/`.
- Reviewed creators are notified at least 30 days before a change to the Creator Charter applies to them.

| Version | Date | Change |
| --- | --- | --- |
| 0.1 | 30 September 2026 | First working draft, reflecting the pilot implementation |
| 0.2 | 30 September 2026 | Section 9: the verification API is implemented (endpoints, errors, rate limiting, caching) |

Open questions for v1.0: the validity period for reviews and the `expired` status; the governance body beyond a single operator; authentication for any future write access.
