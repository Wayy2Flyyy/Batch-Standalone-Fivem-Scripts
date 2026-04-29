local hasShown = false

AddEventHandler('playerSpawned', function()
    if hasShown then return end
    hasShown = true

    Citizen.Wait(2000)

    SendNUIMessage({
        action       = 'showWelcome',
        serverName   = Config.ServerName,
        message      = Config.WelcomeMessage,
        duration     = Config.DisplayDuration,
        accentColor  = Config.AccentColor,
        playerName   = GetPlayerName(PlayerId()),
    })
end)
