# Design Team Portfolio — Sciences Po médialab

Portfolio des projets de l'équipe design du médialab, déployé automatiquement sur GitHub Pages.

## Ajouter un nouveau projet

### 1. Créer le projet

```bash
bun scripts/create-project.ts TAG "Titre du projet"
```

Exemple :

```bash
bun scripts/create-project.ts MONPROJ "Mon Beau Projet"
```

Cette commande crée `src/lib/projects/MONPROJ/project.yaml`.

### 2. Ajouter les fichiers

- Déposer les images (`.png`, `.jpg`, `.webp`, `.avif`, `.gif`), vidéos (`.mp4`, `.mov`) et PDFs dans `src/lib/projects/MONPROJ/`
- Ajouter au moins une image avec `thumb` dans le nom (pour la vignette d'accueil)

### 3. Modifier project.yaml

Éditer `src/lib/projects/MONPROJ/project.yaml` :

```yaml
title: 'Mon Beau Projet'
description: 'Description du projet'
link: 'https://exemple.com'
tag: MONPROJ
year_begin: '2024'
```

Options supplémentaires : `year_end`, `project_type`, `team_people`, `author`.

### 4. Prévisualiser en local (optionnel)

```bash
bun install    # première fois seulement
bun run dev    # http://localhost:5173
```

### 5. Push sur GitHub — le déploiement est automatique

```bash
git add src/lib/projects/MONPROJ/
git commit -m "feat: ajout projet MONPROJ"
git push origin main
```

La GitHub Action s'occupe de tout : bootstrap, dither, build → déploiement sur GitHub Pages.

## Commandes utiles

| Commande | Utilité |
|----------|---------|
| `bun run dev` | Serveur de développement |
| `bun run validate` | Valide tous les projets |
| `bun run imgYmlCreator` | Crée les fichiers .yml de description pour chaque média |
| `bun run dither` | Génère les vignettes dithered |
| `bun run build` | Build complet (dither + build) |

## Structure d'un projet

```
src/lib/projects/MONPROJ/
├── project.yaml
├── THUMB.png              # Vignette d'accueil
├── image1.jpg
├── image2.png
├── video1.mp4
├── _videos/               # Vidéos (déplacées auto au push)
├── _documents/            # PDFs (déplacés auto au push)
└── _gallery/              # Sous-galerie (optionnel)
```

## Captions (légendes)

Pour ajouter des légendes aux médias, éditer le champ `media_captions` dans project.yaml :

```yaml
media_captions:
  image1.jpg: 'Légende de l'image'
  video1.mp4: 'Légende de la vidéo'
```

Ou lancer `bun run imgYmlCreator` pour créer des fichiers `.yml` séparés.
