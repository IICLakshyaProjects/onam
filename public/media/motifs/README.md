# Onam motif images (optional)

This folder is empty on purpose. The presentation draws each background
motif as a hand-drawn vector icon by default (see
`src/components/effects/OnamMotifs.tsx`). Drop a real photo/illustration
here using one of the exact filenames below, and the app will automatically
switch that motif from the drawn icon to your image — no code changes
needed, no restart required beyond a normal reload.

Expected base names — save as either `.webp` **or** `.png` (both are
checked automatically; `.webp` is preferred first if both exist):

- `chenda` — festival drum
- `pulikali` — tiger dance
- `lamp` — nilavilakku (standing oil lamp)
- `pookalam` — flower rangoli
- `leaf` — banana leaf
- `boat` — vallam kali (snake boat)
- `thiruvathira` — dance circle
- `sadya` — feast leaf

So for the chenda motif, either `chenda.webp` or `chenda.png` works — no
need to provide both, just whichever format you have on hand.

Notes:

- Square-ish, transparent-background images work best — they're displayed
  small (roughly 80–110px) and floating at the edges of each scene.
- Missing files are expected and harmless: each candidate is checked once
  per page load and the app quietly falls back to the drawn icon if
  neither format is there.
- The mapping lives in `src/config/onam.ts` under `media.motifImages`
  (built by the `motifCandidates()` helper), in case you want to add more
  formats, rename these, or host them elsewhere (e.g. a CDN URL, same as
  the previous-year video).
