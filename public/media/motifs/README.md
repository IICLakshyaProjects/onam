# Onam motif images (optional)

This folder is empty on purpose. The presentation draws each background
motif as a hand-drawn vector icon by default (see
`src/components/effects/OnamMotifs.tsx`). If you want to use real
photos/illustrations instead, add them here and wire them into
`src/config/onam.ts`.

Expected base names:

- `chenda` — festival drum
- `pulikali` — tiger dance
- `lamp` — nilavilakku (standing oil lamp)
- `pookalam` — flower rangoli
- `leaf` — banana leaf
- `boat` — vallam kali (snake boat)
- `thiruvathira` — dance circle
- `sadya` — feast leaf

Notes:

- Square-ish, transparent-background images work best - they're displayed
  small (roughly 80-110px) and floating at the edges of each scene.
- The default config keeps `media.motifImages` empty, so the app never
  probes this folder unless you explicitly populate the mapping.
