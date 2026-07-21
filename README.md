# Design Team Portfolio — Sciences Po médialab

A shared visual space for projects by the médialab design team. Automatically deployed to GitHub Pages.

## Adding a new project

### 1. Scaffold the project

```bash
bun scripts/create-project.ts TAG "Project Title"
```

Example:

```bash
bun scripts/create-project.ts MYPROJ "My Project"
```

This creates `src/lib/projects/MYPROJ/project.yaml` with basic fields.

### 2. Add media files

Drop images (`.png`, `.jpg`, `.webp`, `.avif`, `.gif`), videos (`.mp4`, `.mov`), and PDFs into `src/lib/projects/MYPROJ/`.

Include at least one image with `thumb` in the filename — it becomes the homepage card thumbnail.

### 3. Edit project.yaml

```yaml
title: 'My Project'
description: 'A short description of the project'
link: 'https://example.com'
tag: MYPROJ
year_begin: '2024'
```

Optional: `year_end`, `project_type`, `team_people`, `author`.

### 4. Preview locally (optional)

```bash
bun install    # first time only
bun run dev    # http://localhost:5173
```

### 5. Push to GitHub — auto-deployed

```bash
git add src/lib/projects/MYPROJ/
git commit -m "feat: add MYPROJ project"
git push origin main
```

The GitHub Action handles the rest: bootstrap, dithering, build → GitHub Pages.

## Useful commands

| Command | What it does |
|---------|--------------|
| `bun run dev` | Start dev server |
| `bun run validate` | Validate all project folders |
| `bun run imgYmlCreator` | Create missing `.yml` description files for media |
| `bun run dither` | Generate dithered thumbnails |
| `bun run build` | Full build (dither + dither check + vite) |

## Project structure

```
src/lib/projects/MYPROJ/
├── project.yaml
├── THUMB.png              # Homepage card thumbnail
├── image1.jpg
├── image2.png
├── video1.mp4
├── _videos/               # Videos (auto-sorted on push)
├── _documents/            # PDFs (auto-sorted on push)
└── _gallery/              # Sub-gallery (optional)
```

## Captions

Add captions for each media file directly in `project.yaml`:

```yaml
media_captions:
  image1.jpg: 'A descriptive caption'
  video1.mp4: 'Description of the video'
```

Or run `bun run imgYmlCreator` to generate separate `.yml` files.
