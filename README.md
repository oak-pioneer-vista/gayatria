# gayatria

Landing page for Gayatria — a home healthcare service. Built as a single-page React app, served as a static bundle from nginx, deployed on Google Cloud Run.

> **Note:** This repo exists to showcase the landing page. It is not a complete product — the search bar, Login/Sign up, and Explore/Chat with Expert CTAs are placeholders that don't route or call a backend. The deployment pipeline and frontend are real and functional; the application behavior behind those interactions is not.

## Live deployment

| | |
| --- | --- |
| Live URL | https://gayatria-react-981984388647.us-central1.run.app |
| GCP project | `omnom-ra` |
| Cloud Run region | `us-central1` |
| Service | `gayatria-react` |
| Cloud Run console | https://console.cloud.google.com/run/detail/us-central1/gayatria-react/metrics?project=omnom-ra |
| Cloud Build history | https://console.cloud.google.com/cloud-build/builds?project=omnom-ra |
| Artifact Registry image | `us-central1-docker.pkg.dev/omnom-ra/cloud-run-source-deploy/gayatria-react` |

Quick checks from a terminal:

```sh
gcloud run services describe gayatria-react --region=us-central1 \
  --format="value(status.url,status.latestReadyRevisionName)"

gcloud run revisions list --service=gayatria-react --region=us-central1 --limit=5
```

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind v4 + shadcn/ui
- `@iconify/react` with a small inlined subset of [healthicons.org](https://healthicons.org/) (see `src/health-icons.ts`)
- Bun for package management

## Develop

```sh
bun install
bun run dev          # http://localhost:5173
bun run build        # tsc -b && vite build → dist/
bun run lint
```

## Brand color

Defined once as a CSS variable in `src/index.css`:

```css
:root { --brand: #7CA982; }
```

Tailwind exposes it as `bg-brand`, `text-brand`, `border-brand`, etc. (and opacity modifiers like `bg-brand/15`).

## Deploy

The repo ships with a Cloud Build pipeline that builds the Docker image, pushes to Artifact Registry, and deploys to Cloud Run.

```sh
gcloud builds submit --config cloudbuild.yaml .
```

Overrideable substitutions (defaults in `cloudbuild.yaml`):

| var | default |
| --- | --- |
| `_REGION` | `us-central1` |
| `_REPOSITORY` | `cloud-run-source-deploy` |
| `_SERVICE` | `gayatria-react` |

### One-time setup

1. Enable APIs: `cloudbuild`, `run`, `artifactregistry`.
2. Create the Artifact Registry Docker repo (matching `_REPOSITORY`).
3. Grant the Cloud Build SA: `roles/run.admin`, `roles/artifactregistry.writer`, `roles/iam.serviceAccountUser`.

### Container

- `Dockerfile` — multi-stage: `oven/bun:1.3-alpine` builds, `nginx:1.27-alpine` serves `dist/`.
- `nginx.conf.template` — listens on `${PORT}` (set by Cloud Run, 8080 locally), SPA fallback to `index.html`, 1y immutable cache on hashed `/assets/*`, no-cache on `index.html` so deploys roll out immediately, gzip on.

Local container check:

```sh
docker build -t gayatria-react .
docker run --rm -p 8080:8080 gayatria-react
```

## Layout

```
src/
  App.tsx              # single-page landing (header, hero, search, service grid)
  health-icons.ts      # inlined SVG subset from healthicons.org
  components/ui/       # shadcn components
  index.css            # Tailwind v4 + theme tokens (--brand lives here)
public/
  logo/gayatria-logo.svg
Dockerfile
nginx.conf.template
cloudbuild.yaml
```
