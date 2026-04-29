local function notifyPlayer(playerId, message)
    if playerId == 0 then
        Danielilli.log(message)
        return
    end

    TriggerClientEvent('danielilli:client:notify', playerId, message)
end

local function registerAnnounceCommand()
    RegisterCommand(Config.commands.announce, function(source, args)
        if not Config.features.announcements.enabled then
            notifyPlayer(source, Config.messages.featureDisabled)
            return
        end

        if source ~= 0 and not IsPlayerAceAllowed(source, Config.permissions.announce) then
            notifyPlayer(source, Config.messages.noPermission)
            return
        end

        local message = Danielilli.trim(table.concat(args, ' '))
        if message == '' then
            notifyPlayer(source, Config.messages.announceUsage)
            return
        end

        TriggerClientEvent('danielilli:client:notify', -1, ('%s %s'):format(Config.features.announcements.prefix, message))
    end, true)
end

local function registerReviveCommand()
    RegisterCommand(Config.commands.revive, function(source, args)
        if not Config.features.revive.enabled then
            notifyPlayer(source, Config.messages.featureDisabled)
            return
        end

        local targetId = tonumber(args[1]) or source
        if source ~= 0 and targetId ~= source and not IsPlayerAceAllowed(source, Config.permissions.reviveOthers) then
            notifyPlayer(source, Config.messages.noPermission)
            return
        end

        if source ~= 0 and targetId == source and not Config.features.revive.allowSelfRevive then
            notifyPlayer(source, Config.messages.noPermission)
            return
        end

        if targetId == 0 or GetPlayerName(targetId) == nil then
            notifyPlayer(source, Config.messages.playerNotFound)
            return
        end

        TriggerClientEvent('danielilli:client:revive', targetId)
        if source ~= targetId and source ~= 0 then
            notifyPlayer(source, Config.messages.playerRevived)
        end
    end, true)
end

local function registerHelpCommand()
    RegisterCommand(Config.commands.help, function(source)
        if not Config.features.help.enabled then
            notifyPlayer(source, Config.messages.featureDisabled)
            return
        end

        local commands = {
            ('/%s'):format(Config.commands.repair),
            ('/%s'):format(Config.commands.clean),
            ('/%s [server id]'):format(Config.commands.revive),
            ('/%s <message>'):format(Config.commands.announce)
        }

        notifyPlayer(source, ('%s %s'):format(Config.messages.helpHeader, table.concat(commands, ', ')))
    end, false)
end

local function registerRepairCommand()
    RegisterCommand(Config.commands.repair, function(source)
        if source == 0 then
            notifyPlayer(source, 'This command can only be used in game.')
            return
        end

        TriggerClientEvent('danielilli:client:repairVehicle', source)
    end, false)
end

local function registerCleanCommand()
    RegisterCommand(Config.commands.clean, function(source)
        if source == 0 then
            notifyPlayer(source, 'This command can only be used in game.')
            return
        end

        TriggerClientEvent('danielilli:client:cleanVehicle', source)
    end, false)
end

CreateThread(function()
    Danielilli.log(('started version %s'):format(Config.version))
    registerHelpCommand()
    registerRepairCommand()
    registerCleanCommand()
    registerAnnounceCommand()
    registerReviveCommand()
end)
