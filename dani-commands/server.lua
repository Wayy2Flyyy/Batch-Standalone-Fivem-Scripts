local function isAdmin(source)
    return IsPlayerAceAllowed(source, Config.AdminPermission)
end

if Config.Commands.heal then
    RegisterCommand('heal', function(source)
        if not isAdmin(source) then return end
        TriggerClientEvent('dani-commands:heal', source)
        print(('[dani-commands] %s used /heal'):format(GetPlayerName(source)))
    end, true)
end

if Config.Commands.armor then
    RegisterCommand('armor', function(source)
        if not isAdmin(source) then return end
        TriggerClientEvent('dani-commands:armor', source)
        print(('[dani-commands] %s used /armor'):format(GetPlayerName(source)))
    end, true)
end

if Config.Commands.teleport then
    RegisterCommand('tp', function(source, args)
        if not isAdmin(source) then return end
        if #args < 3 then
            TriggerClientEvent('chat:addMessage', source, {
                args = {'System', 'Usage: /tp [x] [y] [z]'}
            })
            return
        end
        local x = tonumber(args[1])
        local y = tonumber(args[2])
        local z = tonumber(args[3])
        if x and y and z then
            TriggerClientEvent('dani-commands:teleport', source, x, y, z)
            print(('[dani-commands] %s teleported to %.1f, %.1f, %.1f'):format(GetPlayerName(source), x, y, z))
        end
    end, true)
end

if Config.Commands.announce then
    RegisterCommand('announce', function(source, args)
        if not isAdmin(source) then return end
        local msg = table.concat(args, ' ')
        TriggerClientEvent('chat:addMessage', -1, {
            color = {231, 76, 60},
            args = {'ANNOUNCEMENT', msg}
        })
        print(('[dani-commands] %s announced: %s'):format(GetPlayerName(source), msg))
    end, true)
end

if Config.Commands.clearChat then
    RegisterCommand('clearchat', function(source)
        if not isAdmin(source) then return end
        TriggerClientEvent('chat:clear', -1)
        print(('[dani-commands] %s cleared chat'):format(GetPlayerName(source)))
    end, true)
end

if Config.Commands.noclip then
    RegisterCommand('noclip', function(source)
        if not isAdmin(source) then return end
        TriggerClientEvent('dani-commands:noclip', source)
        print(('[dani-commands] %s toggled noclip'):format(GetPlayerName(source)))
    end, true)
end

if Config.Commands.dv then
    RegisterCommand('dv', function(source)
        if not isAdmin(source) then return end
        TriggerClientEvent('dani-commands:dv', source)
        print(('[dani-commands] %s deleted a vehicle'):format(GetPlayerName(source)))
    end, true)
end

if Config.Commands.car then
    RegisterCommand('car', function(source, args)
        if not isAdmin(source) then return end
        local model = args[1] or 'adder'
        TriggerClientEvent('dani-commands:car', source, model)
        print(('[dani-commands] %s spawned %s'):format(GetPlayerName(source), model))
    end, true)
end
