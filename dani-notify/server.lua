RegisterNetEvent('dani-notify:sendToPlayer')
AddEventHandler('dani-notify:sendToPlayer', function(targetId, type, message, duration)
    TriggerClientEvent('dani-notify:send', targetId, type, message, duration)
end)

exports('SendNotificationToPlayer', function(targetId, type, message, duration)
    TriggerClientEvent('dani-notify:send', targetId, type, message, duration)
end)

exports('SendNotificationToAll', function(type, message, duration)
    TriggerClientEvent('dani-notify:send', -1, type, message, duration)
end)
