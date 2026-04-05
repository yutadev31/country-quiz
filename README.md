# Country Quiz

Country Quiz is a React + Vite quiz app for memorizing countries and first-level administrative divisions. It includes a quiz mode for fast recall and a study table for browsing the underlying data.

The project also contains a Tauri setup, so the same frontend can be packaged as a desktop app and used as a base for Android builds.

## Features

- Multiple quiz domains: countries, US states, Canadian provinces, Mexican states, French regions, and German states
- Region-specific country modes: Asia, Europe, Africa, North America, South America, and Oceania
- Configurable question and answer formats such as name, native name, capital, flag, and top-level domain
- Rule presets plus custom settings for question count and time limit
- One-shot mode that ends the run immediately after the first mistake
- Study page with a searchable-style overview table for each supported mode
- Japanese UI via `react-i18next`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- `nuqs` for URL query state
- Biome for formatting and linting
- Tauri 2 for desktop/mobile packaging

## Supported Modes

### Countries

- All countries
- Asia
- Europe
- Africa
- North America
- South America
- Oceania

### Administrative divisions

- United States states
- Canada provinces
- Mexico states
- France regions
- Germany states

## Project Structure

```text
src/
  components/     UI for the launcher and quiz flow
  data/           Quiz datasets and mode definitions
  i18n/           Translation setup
  pages/          Home, game, and study pages
src-tauri/        Tauri application config and Rust entrypoints
gen/              Dataset source files and generation scripts
```

## Requirements

- Bun
- Node.js
- Rust toolchain and Tauri prerequisites if you want to build the desktop app
- Python 3 with `pandas` if you want to regenerate datasets

If you use Nix, this repository includes [`flake.nix`](./flake.nix) for a development shell with Rust, Java, Python, and related tooling.

## Development

Install dependencies:

```bash
bun install
```

Start the web app:

```bash
bun run dev
```

Build the web app:

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## Tauri

Run the Tauri app in development:

```bash
bun run tauri dev
```

Build the Tauri app:

```bash
bun run tauri build
```

The Tauri configuration is defined in [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json).

## Data Generation

The quiz data lives under `src/data/`. Raw source data used for transformation is stored in `gen/data/`, and the conversion logic is implemented in [`gen/main.py`](./gen/main.py).

To regenerate the JSON datasets:

```bash
python gen/main.py
```

The generator formats the output with Biome after writing each file.

## Linting and Formatting

```bash
bun run format
bun run lint
bun run check
```

Note: in this project, `lint` and `check` are configured with `--write`, so they may modify files.

## Routing and Deployment Notes

The Vite `base` path is set to `/country-quiz` in [`vite.config.ts`](./vite.config.ts). If you deploy the app under a different subpath or at the domain root, update that setting accordingly.

## Localization

The current UI resources are stored in [`src/i18n/ja.json`](./src/i18n/ja.json), and the app currently initializes Japanese as the default language.

## License

MIT. See [`LICENSE`](./LICENSE).
