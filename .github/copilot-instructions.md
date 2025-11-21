## Repo quick facts

- Project: SPFx web part "rolling-text" (SharePoint Framework v1.21.1).
- Primary language: TypeScript (built with SPFx tooling / gulp).
- Key folders: `src/` (source TS), `lib/` (compiled JS and typings), `release/` (packaged assets), `webparts/rollingText/` (built webpart bundles).

## What an AI coding agent should know (short)

- This repository is an SPFx web part. Typical developer workflow uses `npm install` then `gulp` tasks (see `package.json`): `npm run build` -> `gulp bundle`, `npm run clean` -> `gulp clean`, `npm run test` -> `gulp test`.
- Local development often uses `gulp serve` (SPFx local workbench). The `gulpfile.js` overrides the `serve` task to use the deprecated serve task alias.
- Do not change SPFx package versions in `package.json` without coordinating with the project owner: many versions are tied to the SPFx framework (1.21.1).

## Architecture & structure (why it is organized this way)

- SPFx pattern: `src/webparts/rollingText/` contains the TypeScript web part source. The build produces `lib/` and `release/` artifacts. Release also contains localized strings in `release/assets` and a pre-built `rolling-text-web-part.js` bundle.
- The web part integrates with Fluent UI and PnP libraries (see `package.json` deps). Expect React components or property pane controls under `src/webparts/rollingText`.
- Manifest files live under `release/manifests/` and `temp/manifests.js` during build; `config/` contains packaging and deployment JSON files used by the SPFx toolchain.

## Patterns and conventions specific to this repo

- Version pinning: SPFx and related packages are pinned at `1.21.1`. Maintain these unless bumping the SPFx baseline.
- Bundles and maps: prebuilt bundles exist in `release/assets/` and `webparts/rollingText/` (built JS + .map). Use these as references when debugging runtime issues in a deployed package.
- Localize strings: localized resource files live in `release/assets/PropertyControlStrings_*.js` and `release/RollingTextWebPartStrings_en-us.js`.

## Common tasks and exact commands

- Install dependencies:

  npm install

- Build (bundle):

  npm run build

- Clean:

  npm run clean

- Run tests (SPFx gulp test):

  npm run test

- Local workbench / serve:

  gulp serve

Notes: The `package.json` maps `build` -> `gulp bundle`. Some SPFx projects use `gulp bundle --ship` and `gulp package-solution --ship` when preparing production packages.

## Files an AI agent will edit frequently

- `src/webparts/rollingText/RollingTextWebPart.ts` — main web part class (entry point). This is often where property pane and lifecycle code lives.
- `src/index.ts` — solution entry, may export components.
- `config/*.json` — packaging and deployment settings (do not break JSON schema used by SPFx tooling).
- `gulpfile.js` — the build rig customization (small; only modify with care).

## Debugging tips and examples from this repo

- To repro runtime errors in a built bundle, compare `src/...` against `release/assets/rolling-text-web-part.js` and `.map` files. Source maps are available in `release/` and `webparts/rollingText/`.
- If property pane typings or localized strings are missing, inspect `release/assets/PropertyControlStrings_*.js` for expected keys.

## Safe edit rules for AI

- Prefer edits in `src/` TypeScript source. Do not directly edit `lib/`, `release/` or `webparts/*` generated bundles—these are build outputs.
- When changing dependencies or SPFx versions, add a short note in README and run a build locally to ensure compatibility.
- Keep changes minimal and compile-friendly: run `npm run build` (or `gulp bundle`) after code edits to ensure no type or build errors.

## Example actionable change request templates

- Bugfix (runtime): "Fix X where the rolling text stops after N characters; update `src/webparts/rollingText/RollingTextWebPart.ts` to guard against nulls and add unit smoke test if present." — AI should alter TS, run `npm run build`, and mark generated outputs untouched.
- Small feature: "Add a property to control speed" — modify property pane in `RollingTextWebPart.ts`, add property to web part interface, update UI component under `src/webparts/rollingText/components` (if present), run build.

## Where to look for more context

- `README.md` for high-level usage; `package.json` for script shortcuts; `gulpfile.js` for build rig tweaks; `config/` for packaging; `release/` for built artifacts and localized assets.

---

If anything here is unclear or you want additional examples (e.g., snippets from `RollingTextWebPart.ts` or exact property names), tell me which area to expand and I will update this guidance.
