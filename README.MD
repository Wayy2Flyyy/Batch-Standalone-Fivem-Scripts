# Danielilli Standalone FiveM Scripts

Standalone FiveM resource with small server utilities that do not require ESX,
QBCore, ox_lib, or any other framework.

## Current resource

`danielilli_standalone` includes:

- `/dhelp` - list available commands.
- `/drepair` - repair the current vehicle.
- `/dclean` - clean the current vehicle.
- `/drevive [server id]` - revive yourself or another player.
- `/dannounce <message>` - broadcast a server announcement.
- Optional join welcome message.

All commands, cooldowns, messages, and ACE permissions are configurable in
`danielilli_standalone/shared/config.lua`.

## Requirements

- A current FiveM server artifact that supports `fx_version 'cerulean'`.
- Lua 5.4 enabled by the resource manifest.
- No npm, Python, database, or framework dependencies.

## Installation

1. Copy the `danielilli_standalone` folder into your server `resources` folder.
2. Add the resource to `server.cfg`:

   ```cfg
   ensure danielilli_standalone
   ```

3. Restart the server or run:

   ```cfg
   refresh
   ensure danielilli_standalone
   ```

## Permissions

The announce and targeted revive commands use ACE permissions by default:

```cfg
add_ace group.admin danielilli.announce allow
add_ace group.admin danielilli.revive allow
```

Players can self-revive only when `Config.features.revive.allowSelfRevive` is
enabled.

## Configuration

Edit `danielilli_standalone/shared/config.lua` to:

- Rename commands.
- Disable individual features.
- Change cooldowns.
- Require the player to be the vehicle driver for repair/clean commands.
- Change chat messages and announcement prefixes.

## Development checks

This repository intentionally avoids runtime package dependencies. The included
validator checks that required deployment files exist and that Lua files are
plain ASCII without tab indentation:

```bash
npm run validate
```

## Deployment checklist

- Run `npm run validate`.
- Confirm `ensure danielilli_standalone` is in `server.cfg`.
- Confirm ACE permissions are configured for staff-only commands.
- Start the resource on a test server and verify each enabled command.
