Config = {}

Config.Command = {
    name = 'dsui',
    description = 'Open the Danielilli Scripts control panel.',
    defaultKey = 'F7'
}

Config.Ui = {
    title = 'Danielilli Scripts',
    subtitle = 'Standalone scripts with a modern visual UI.',
    accentColor = '#7c5cff',
    openMessage = 'Danielilli Scripts panel opened.',
    closeMessage = 'Danielilli Scripts panel closed.'
}

Config.Actions = {
    {
        id = 'welcome',
        label = 'Send welcome message',
        description = 'Shows a client notification to confirm the resource is running.',
        serverMessage = 'Danielilli Scripts is ready.'
    },
    {
        id = 'status',
        label = 'Check resource status',
        description = 'Confirms the server event pipeline is responding.',
        serverMessage = 'Server bridge is online.'
    }
}
