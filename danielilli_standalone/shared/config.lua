Config = {}

Config.resourceName = 'Danielilli Standalone'
Config.version = '0.1.0'
Config.useNativeNotifications = false

Config.commands = {
    help = 'dhelp',
    repair = 'drepair',
    clean = 'dclean',
    revive = 'drevive',
    announce = 'dannounce'
}

Config.permissions = {
    announce = 'danielilli.announce',
    reviveOthers = 'danielilli.revive'
}

Config.features = {
    help = {
        enabled = true
    },
    repair = {
        enabled = true,
        requireDriver = true,
        repairEngine = true,
        repairBody = true,
        cleanVehicle = true,
        cooldownSeconds = 60
    },
    clean = {
        enabled = true,
        requireDriver = true,
        cooldownSeconds = 30
    },
    revive = {
        enabled = true,
        allowSelfRevive = true,
        reviveHealth = 200,
        cooldownSeconds = 120
    },
    announcements = {
        enabled = true,
        prefix = '^5[Server]^7'
    },
    joinMessage = {
        enabled = true,
        message = 'Welcome to the server! Type /dhelp for available standalone commands.'
    }
}

Config.messages = {
    featureDisabled = 'That feature is disabled.',
    notInVehicle = 'You need to be in a vehicle.',
    notDriver = 'You must be the driver to use this command.',
    onCooldown = 'Please wait %s seconds before using this command again.',
    vehicleRepaired = 'Vehicle repaired.',
    vehicleCleaned = 'Vehicle cleaned.',
    revived = 'You have been revived.',
    announceUsage = 'Usage: /dannounce <message>',
    noPermission = 'You do not have permission to use that command.',
    playerNotFound = 'Player not found.',
    playerRevived = 'Player revived.',
    helpHeader = '^5Danielilli Standalone commands:^7'
}
