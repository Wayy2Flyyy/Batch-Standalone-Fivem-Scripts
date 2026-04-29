# Deployment Guide

This repository is now structured as a standalone FiveM resource.

## Resource layout

- `fxmanifest.lua` - FiveM resource manifest.
- `config/settings.lua` - Shared configuration for the command, UI text, and starter actions.
- `client/main.lua` - Client-side command, NUI, and focus handling.
- `server/main.lua` - Server-side action handling and status logging.
- `web/` - Browser-based NUI panel.
- `scripts/validate-resource.sh` - Lightweight repository validation script.

## Install on a FiveM server

1. Copy this folder into your server `resources` directory.
2. Rename the folder if desired, for example `danielilli_scripts`.
3. Add the resource to `server.cfg`:

   ```cfg
   ensure danielilli_scripts
   ```

4. Restart the server or run:

   ```cfg
   refresh
   ensure danielilli_scripts
   ```

## Runtime usage

- `/dsui` opens the UI panel.
- Press `F7` to toggle the panel with the default key mapping.
- Use the action buttons to verify client-to-server event handling.
- Press `Esc` or the close button to close the panel.

## Pre-deployment validation

Run the included validation script before packaging:

```sh
./scripts/validate-resource.sh
```

The script checks for required files and verifies that each file referenced in
`fxmanifest.lua` exists.
