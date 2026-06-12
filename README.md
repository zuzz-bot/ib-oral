# IB Oral — English B SL

Study tool for the **IB English B SL Individual Oral**. 5 themes, 12 topics, with
data for the UK, USA and India. Migrated from a single-file vanilla HTML app to a
modern React stack.

**Live:** https://zuzz-bot.github.io/ib-oral

## Stack

- **React 18** + **Vite**
- **Motion** (`motion/react`) — cinematic transitions, spring physics, card fly-up
- **Tailwind CSS v4** for layout, hand-written CSS for the signature effects
  (Instax cards, animated gradient, bottom drawer)
- **@phosphor-icons/react** for icons
- **vite-plugin-pwa** — installable, works offline after first load

## Develop

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run icons      # regenerate PWA icons from scripts/gen-icons.mjs
```

## Deploy (GitHub Pages)

```bash
npm run deploy     # builds and publishes dist/ to the gh-pages branch
```

The Vite `base` is set to `/ib-oral/` to match the repo name.

## Structure

```
src/
├── main.jsx            app entry
├── App.jsx             screen orchestration + history-backed navigation
├── data/
│   ├── content.js      themes, photos, IB descriptions, quotes, full topic DATA
│   └── phrases.js      useful oral phrases
├── components/
│   ├── GradientBg.jsx  animated gradient that bleeds toward the theme accent
│   ├── EnterScreen.jsx
│   ├── HomeScreen.jsx  5 floating Instax theme cards
│   ├── TopicsScreen.jsx
│   ├── InstaxCard.jsx  tilt + float + spotlight + fly-up
│   ├── Drawer.jsx      bottom sheet, drag-to-close, 6 tabs
│   ├── Ghost.jsx       mascot with rotating motivational quotes
│   └── tabs/           Vocab, Countries, Sources, Questions, Phrases, IBCriteria
├── hooks/
│   ├── useProgress.js  per-topic progress in localStorage (ib_oral_prog_v4)
│   └── useTilt.js      3D cursor tilt + spotlight
└── styles/globals.css
```

## Features

- Enter screen → home (Instax theme cards) → topics → bottom drawer
- Card 3D tilt + cursor spotlight; clicked card flies up, siblings fade
- Per-topic progress (Not started / In progress / Done), saved to localStorage
- Drawer tabs: Vocabulary, Countries (single **and** side-by-side compare),
  Sources, Questions, **Oral phrases**, IB Criteria
- Cinematic editorial photo treatment (desaturated → full colour on hover)
- Browser/phone back button closes the drawer and returns home
- Installable PWA with offline caching of remote images

### Pending

- IB Criteria tab content — waiting on the official IB mark-band document.

## Data

`src/data/content.js` was generated once from the original single-file HTML and
holds all topic content (~200 KB). Source entries use both `desc` and
`description` keys; `SourcesTab` handles either.
