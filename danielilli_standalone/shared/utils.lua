Danielilli = Danielilli or {}

local RESOURCE_NAME = GetCurrentResourceName and GetCurrentResourceName() or 'danielilli_standalone'

function Danielilli.log(message)
    print(('[%s] %s'):format(RESOURCE_NAME, tostring(message)))
end

function Danielilli.trim(value)
    if type(value) ~= 'string' then
        return ''
    end

    return value:match('^%s*(.-)%s*$') or ''
end

function Danielilli.command(name)
    if type(Config) ~= 'table' or type(Config.commands) ~= 'table' then
        return nil
    end

    return Config.commands[name]
end

function Danielilli.feature(name)
    if type(Config) ~= 'table' or type(Config.features) ~= 'table' then
        return nil
    end

    return Config.features[name]
end

function Danielilli.notifyClient(target, message)
    TriggerClientEvent('chat:addMessage', target, {
        color = { 80, 200, 120 },
        multiline = true,
        args = { Config.resourceName or RESOURCE_NAME, message }
    })
end
