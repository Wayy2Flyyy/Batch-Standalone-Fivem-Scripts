local resourceName = GetCurrentResourceName()

local function log(message)
    print(('[%s] %s'):format(resourceName, message))
end

RegisterNetEvent('danielilli_scripts:runAction', function(actionId)
    local playerId = source

    for _, action in ipairs(Config.Actions) do
        if action.id == actionId then
            TriggerClientEvent('danielilli_scripts:notify', playerId, action.serverMessage)
            log(('player %s selected action %s'):format(playerId, action.id))
            return
        end
    end

    TriggerClientEvent('danielilli_scripts:notify', playerId, 'Unknown action selected.')
end)

AddEventHandler('onResourceStart', function(startedResource)
    if startedResource ~= resourceName then
        return
    end

    log(('started with UI command /%s'):format(Config.Command.name))
end)
