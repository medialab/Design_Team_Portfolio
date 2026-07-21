# Design Team Portfolio – Sciences Po médialab

This repository hosts the portfolio of the **design team inside Sciences Po's médialab**.  
It provides a **shared visual space** where projects initiated within the design team can be explored by internal and external audiences.

## Tech Stack

- Svelte 5 / SvelteKit 2
- TypeScript
- Tailwind CSS 4
- Vite 7 + vite-imagetools
- Bun
- Static site generation (GitHub Pages)

## Purpose

- **Document projects**: track visual, interactive, and editorial outputs.
- **Share with others**: offer a clear entry point for discovering the team's work.
- **Support collaboration**: reference past projects when starting new ones.

## How to Contribute

For **design team members**:

1. **Create a project folder**  
   Inside `src/lib/media/`, create a folder named with the project's **TAG** (all caps, e.g. `AIME`).

2. **Add a `project.yaml`**  
   Inside the project folder, create `project.yaml`:

   ```yaml
   title: 'Title of your project'
   description: 'Description of your project'
   link: 'https://website.url'
   tag: 'YOUR_TAG'
   year_begin: 'YYYY'
   ```

   Optional fields: `year_end`, `project_type`, `team_people`, `author`.

3. **Upload your media files**  
   Supported formats:
   - Images: `.png`, `.jpg`, `.webp`, `.avif`, `.gif`
   - Video: `.mp4`, `.mov`
   - Documents: `.pdf`

4. **Add a thumbnail**  
   Include at least one image with `thumb` in the filename. This is used for the homepage card.

5. **Add descriptions (optional)**  
   For each media file, create a companion `.yml` file with:
   ```yaml
   imgDescription: "Caption text here"
   ```

6. **Run dither pipeline**  
   ```bash
   bun run dither:all
   ```

7. **Test locally**  
   ```bash
   bun run dev
   ```

8. **Open a pull request**

## Available Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Development server |
| `build` | Full build (dither + check + vite) |
| `check` | Svelte type checking |
| `lint` | Prettier formatting check |
| `dither` | Generate dithered thumbnails |
| `dither:check` | Validate dither parity |
| `migrate` | Migrate `main.yaml` entries to per-project `project.yaml` |
| `validate` | Validate all project folders |
| `imgYmlCreator` | Create missing `.yml` description files |
| `sync-media` | Create missing media folders from `main.yaml` |

## Project Structure

```
src/lib/media/<TAG>/
├── project.yaml        # Project metadata (auto-discovered)
├── thumb.*             # Homepage card thumbnail
├── *.yml               # Per-file descriptions
├── *.jpg / *.png / etc # Media files
├── *.mp4 / *.mov       # Video files
├── *.pdf               # PDF documents
└── _gallery/           # Sub-gallery images (optional)
```

## Configuration

Set environment variables to customise the production URL:

```bash
SITE_ORIGIN=https://example.com SITE_BASE_PATH=/portfolio bun run build
```

## Deployment

Automatically deployed to GitHub Pages on push to `main`. See `.github/workflows/deploy.yml`. The dither pipeline runs as part of the build.

## Browser Compatibility Policy

This project targets **current stable browsers**:

- Chrome (latest major)
- Edge (latest major)
- Firefox (latest major)
- Safari (latest major)
- iOS Safari (latest major)

Not in scope:

- Internet Explorer
- Legacy Safari/iOS versions

Compatibility is codified via `browserslist` in `package.json`.
