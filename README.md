# Danielilli Scripts

A curated collection of modern, easy-to-install standalone scripts, served from a clean static site with a modern visual UI.

This repository contains:

- A static landing page (`index.html`, `assets/`) that catalogs available scripts.
- A `scripts/` directory holding the actual standalone scripts that users can download or pipe into a shell.
- A `scripts.json` manifest the site reads to render the catalog dynamically.
- A GitHub Pages deployment workflow under `.github/workflows/deploy.yml`.

## Project structure

```
.
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── assets/
│   ├── styles.css                 # Modern UI styles
│   └── app.js                     # Renders catalog from scripts.json
├── scripts/
│   └── hello.sh                   # Example standalone script
├── scripts.json                   # Manifest of available scripts
├── index.html                     # Landing page
├── LICENSE
├── .gitignore
└── README.md
```

## Local development

This is a fully static site — no build step required. Serve the directory with any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node:

```bash
npx serve .
```

## Adding a new script

1. Drop your script file into `scripts/` (e.g. `scripts/my-tool.sh`). Make it executable with `chmod +x scripts/my-tool.sh`.
2. Add a corresponding entry to `scripts.json`:

   ```json
   {
     "id": "my-tool",
     "name": "My Tool",
     "description": "Short description of what the script does.",
     "file": "scripts/my-tool.sh",
     "tags": ["bash", "utility"]
   }
   ```

3. Commit and push — the deploy workflow will publish the updated catalog to GitHub Pages.

## Installing a script

Each script can be downloaded directly from the catalog page, or installed in one line:

```bash
curl -fsSL https://<your-pages-domain>/scripts/hello.sh | bash
```

## Deployment

Pushes to `main` are automatically deployed to GitHub Pages via `.github/workflows/deploy.yml`. To enable it:

1. In the repository settings, set **Pages → Source** to **GitHub Actions**.
2. Push to `main`. The workflow uploads the repo as a Pages artifact and deploys it.

## License

MIT — see [`LICENSE`](./LICENSE).
