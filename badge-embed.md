# Embedding a Human Origin badge

Badges are images served by the label (Specification v0.1, Section 7). Always use the code given by
the reviewer or generated on the label's site: do not alter, crop or recolour the badge.

## Reviewed badge (green)

Links to the creator's verification page. Replace `0001` with your number and `illustration` with a
discipline you were reviewed for.

```html
<a href="https://human-origin-label.lochness-paris.com/verify/HO-2026-0001" target="_blank" rel="noopener"
   title="Human Origin Label – Human Illustration, process reviewed No. HO-2026-0001">
  <img src="https://human-origin-label.lochness-paris.com/badges/badge-illustration-reviewed-light-0001.svg"
       alt="Human Origin Label – Human Illustration, process reviewed No. HO-2026-0001"
       width="380" height="112" style="max-width:100%;height:auto;border:0">
</a>
```

## Self-declared badge (orange)

```html
<a href="https://human-origin-label.lochness-paris.com/" target="_blank" rel="noopener">
  <img src="https://human-origin-label.lochness-paris.com/badges/badge-writing-declared-light.svg"
       alt="Human Origin Label – Human Writing, self-declared by the creator, not reviewed"
       width="380" height="112" style="max-width:100%;height:auto;border:0">
</a>
```

## Sizes and formats

Add `-m` (300 × 88) or `-s` (230 × 48) before `.svg`; use `seal-` instead of `badge-` for the round
seal (160, 112 or 72 px). Watermarks (`watermark-…`) are available to reviewed creators only.
