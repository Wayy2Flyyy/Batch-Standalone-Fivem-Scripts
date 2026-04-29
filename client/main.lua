local uiOpen = false

local function notify(message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message)
    EndTextCommandThefeedPostTicker(false, false)
end

local function sendUiState(action)
    SendNUIMessage({
        action = action,
        resourceName = GetCurrentResourceName(),
        commandName = Config.Command.name,
        title = Config.Ui.title,
        subtitle = Config.Ui.subtitle,
        accentColor = Config.Ui.accentColor,
        actions = Config.Actions
    })
end

local function setUiOpen(shouldOpen)
    uiOpen = shouldOpen
    SetNuiFocus(shouldOpen, shouldOpen)
    sendUiState(shouldOpen and 'open' or 'close')

    if shouldOpen then
        notify(Config.Ui.openMessage)
    end
end

RegisterCommand(Config.Command.name, function()
    setUiOpen(not uiOpen)
end, false)

RegisterKeyMapping(Config.Command.name, Config.Command.description, 'keyboard', Config.Command.defaultKey)

RegisterNUICallback('ready', function(_, cb)
    sendUiState('setConfig')
    cb({ ok = true })
end)

RegisterNUICallback('close', function(_, cb)
    setUiOpen(false)
    notify(Config.Ui.closeMessage)
    cb({ ok = true })
end)

RegisterNUICallback('runAction', function(data, cb)
    local actionId = data and data.id
    local actionExists = false

    for _, action in ipairs(Config.Actions) do
        if action.id == actionId then
            actionExists = true
            break
        end
    end

    if not actionExists then
        cb({ ok = false, error = 'Unknown action.' })
        return
    end

    TriggerServerEvent('danielilli_scripts:runAction', actionId)
    cb({ ok = true })
end)

RegisterNetEvent('danielilli_scripts:notify', function(message)
    notify(message)
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() and uiOpen then
        SetNuiFocus(false, false)
    end
end)
