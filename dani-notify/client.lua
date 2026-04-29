RegisterNetEvent('dani-notify:send')
AddEventHandler('dani-notify:send', function(type, message, duration)
    SendNUIMessage({
        action   = 'notify',
        type     = type or 'info',
        message  = message or '',
        duration = duration or Config.DefaultDuration,
        position = Config.Position,
        colors   = Config.Colors,
    })
end)

exports('SendNotification', function(type, message, duration)
    TriggerEvent('dani-notify:send', type, message, duration)
end)
