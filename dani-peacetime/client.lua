local currentState = 'normal'

RegisterNetEvent('dani-peacetime:setState')
AddEventHandler('dani-peacetime:setState', function(state)
    currentState = state

    local message = Config.NormalMessage
    local color = Config.NormalColor

    if state == 'peacetime' then
        message = Config.PeacetimeMessage
        color = Config.PeacetimeColor
    elseif state == 'cooldown' then
        message = Config.CooldownMessage
        color = Config.CooldownColor
    end

    SendNUIMessage({
        action  = 'updateState',
        state   = state,
        message = message,
        color   = color,
    })
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if currentState == 'peacetime' then
            local ped = PlayerPedId()
            DisablePlayerFiring(ped, true)
            DisableControlAction(0, 140, true) -- melee
            DisableControlAction(0, 141, true) -- melee alt
            DisableControlAction(0, 142, true) -- melee alt 2
            DisableControlAction(0, 24, true)  -- attack
            DisableControlAction(0, 25, true)  -- aim
            DisableControlAction(0, 257, true) -- attack 2
            DisableControlAction(0, 263, true) -- melee attack alt
        else
            Citizen.Wait(500)
        end
    end
end)
