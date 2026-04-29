# Danielilli Scripts

Standalone FiveM script resource with a modern NUI control panel and a
deployment-ready file structure.

## What is included

- `fxmanifest.lua` configured for the Cerulean FiveM runtime.
- Shared settings in `config/settings.lua`.
- Client and server Lua entry points.
- A lightweight NUI interface in `web/`.
- A validation script for checking required deployment files.
- Deployment notes in `docs/deployment.md`.

## Quick start

1. Copy this repository into your FiveM server `resources/` directory.
2. Add the resource to `server.cfg`:

   ```cfg
   ensure danielilli_scripts
   ```

3. Restart the server or run `refresh` and `ensure danielilli_scripts`
   in the server console.
4. In game, run `/dsui` to open the UI.

## Validate before deployment

Run the repository validator from the project root:

```sh
./scripts/validate-resource.sh
```

See `docs/deployment.md` for the full deployment checklist.
