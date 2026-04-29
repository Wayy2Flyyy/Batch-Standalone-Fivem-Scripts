local currentState = 'normal' -- 'normal', 'peacetime', 'cooldown'

local function isAdmin(source)
    return IsPlayerAceAllowed(source, Config.AdminPermission)
end

local function broadcastState()
    TriggerClientEvent('dani-peacetime:setState', -1, currentState)
end

RegisterCommand('peacetime', function(source)
    if not isAdmin(source) then return end
    if currentState == 'peacetime' then
        currentState = 'normal'
    else
        currentState = 'peacetime'
    end
    broadcastState()
    print(('[dani-peacetime] %s set state to %s'):format(GetPlayerName(source), currentState))
end, true)

RegisterCommand('cooldown', function(source)
    if not isAdmin(source) then return end
    if currentState == 'cooldown' then
        currentState = 'normal'
    else
        currentState = 'cooldown'
    end
    broadcastState()
    print(('[dani-peacetime] %s set state to %s'):format(GetPlayerName(source), currentState))
end, true)

AddEventHandler('playerJoining', function()
    local src = source
    Citizen.Wait(3000)
    TriggerClientEvent('dani-peacetime:setState', src, currentState)
end)
