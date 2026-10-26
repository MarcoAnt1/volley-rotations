# Volleyball Rotations

An interactive, top-down court that teaches volleyball rotations: step through all six rotations, see where the setter goes, and watch how players line up when serving, receiving and defending.

## Features

- **Six rotations, animated.** Step forward and back, or jump to any rotation; players slide clockwise between zones.
- **Roles on every player.** S, OH, MB, OPP, plus fixed zone numbers 1–6 painted on the court.
- **Three setter systems.** 5-1, 6-2 and 4-2, with the active setter highlighted and a tip on where they should be.
- **Three situations.** Default, Serving and Reception, each with its own formation. 
- **Drag players.** Move anyone around the court with mouse or touch.
- **Overlap validation.** Players who break the overlap rule turn red, with a warning naming the rule. The check follows the real rules: the server is exempt, and there's no check once the rally is on.
- **Light and dark mode.** Follows your system setting.

## Volleyball in 60 seconds

| Term | Meaning |
|---|---|
| **Zones** | Six areas on each side, numbered 1 (back right) counter-clockwise to 6 (back middle). Front row: 4-3-2, back row: 5-6-1. |
| **Rotation** | When your team wins the serve back, everyone moves one zone clockwise: 2 → 1 → 6 → 5 → 4 → 3 → 2. The player arriving in zone 1 serves. |
| **Overlap rule** | At the moment of the serve, each player must be in the correct order relative to their neighbours: front row 4-3-2 left to right, back row 5-6-1, and each back-row player behind their front-row partner. After the serve, everyone moves freely. |
| **5-1** | One setter who sets in all six rotations. |
| **6-2** | Two setters; the one in the back row sets, so there are always three front-row attackers. |
| **4-2** | Two setters; the one in the front row sets. |
| **Roles** | S = setter, OH = outside hitter, MB = middle blocker, OPP = opposite. |

The formations are simplified, standard-style layouts meant for learning; real teams vary them.

## Getting started

Requires Node.js 22.18+ or 24.12+.

```sh
npm install
npm run dev
```

Then open the local URL Vite prints.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run type-check` | Run the TypeScript checker (`vue-tsc`) |
| `npm run format` | Format `src/` with Prettier |

## How it works

Built with **Vue 3**, **TypeScript** and **Vite**. The court is plain **SVG**, with no canvas or chart library and no runtime dependencies besides Vue.

```
src/
├── data/
│   ├── rotations.ts      # zones, rotation cycle, overlap rule, setter systems
│   └── formations.ts     # where players stand in each situation
├── composables/
│   └── useRotation.ts    # current rotation + forward / back / jump
├── components/
│   ├── Court.vue         # the court, dragging, overlap validation
│   └── PlayerToken.vue   # one player: circle, label, pointer handling
├── App.vue               # controls, tips, legend
└── style.css             # design tokens (colors, shadows) + dark mode
```

A few ideas worth knowing before reading the code:

- **Zones are fixed; players move.** Each player has a stable id. `positionOf(player, rotation)` gives the zone they occupy, computed from a single `rotationCycle` array.
- **Rules are plain data.** The overlap rule is two lists of zone pairs (`FRONT_BEHIND`, `LEFT_OF`) in `rotations.ts`, used both to validate positions and to generate legal ones. The data files contain no Vue code.
- **Formations are "where the player in each zone stands".**
  - Reception layouts are hand-made, one per zone of the active setter, so they work for every system.
  - The serve formation starts from each player's specialty spot (outside hitters left, middles middle, setter/opposite right), and `legalize()` moves players until the overlap rule holds.
- **Animation is just CSS.** Each player is an SVG `<g>` positioned with `translate()`; a CSS transition on `transform` makes them slide.
- **Dragging uses pointer events**, so mouse and touch share one code path. `getScreenCTM()` converts screen coordinates into court coordinates.