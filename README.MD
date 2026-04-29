# Danielilli Scripts

A collection of modern, standalone FiveM scripts with clean UIs. Easy to install, fully configurable, zero dependencies.

## Scripts Included

| Script | Description |
|--------|-------------|
| **dani-hud** | Player HUD showing health, armor, and stamina with a modern, minimal design |
| **dani-notify** | Notification system with animated toast-style popups (success, error, info, warning) |
| **dani-speedometer** | Vehicle speedometer with gear indicator and fuel gauge |
| **dani-commands** | Utility commands for players and admins (teleport, heal, announce, etc.) |
| **dani-welcome** | Animated welcome screen displayed when a player joins the server |
| **dani-peacetime** | Peacetime and priority cooldown toggle system for RP servers |

## Installation

1. Download or clone this repository.
2. Copy the script folders you want into your server's `resources` directory.
3. Add each script to your `server.cfg`:

```cfg
ensure dani-hud
ensure dani-notify
ensure dani-speedometer
ensure dani-commands
ensure dani-welcome
ensure dani-peacetime
```

4. Restart your server.

## Configuration

Each script has a `config.lua` file at its root. Open it to customize colors, keybinds, permissions, messages, and more. Every option is documented with comments.

## Requirements

- FiveM server (latest recommended build)
- No external dependencies required — all scripts are fully standalone

## Compatibility

- Works with any framework (ESX, QBCore, vRP) or no framework at all
- No database required
- No exports from other resources needed

## Contributing

Feel free to fork, modify, and submit pull requests. Contributions are welcome.

## License

These scripts are free to use and modify for your FiveM server. Please credit **Danielilli** if you redistribute.
