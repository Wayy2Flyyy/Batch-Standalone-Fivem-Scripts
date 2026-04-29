local clientCooldowns = {}

local function notify(message)
    if Config.useNativeNotifications then
        BeginTextCommandThefeedPost('STRING')
        AddTextComponentSubstringPlayerName(message)
        EndTextCommandThefeedPostTicker(false, true)
        return
    end

    TriggerEvent('chat:addMessage', {
        color = { 80, 200, 120 },
        multiline = true,
        args = { Config.resourceName, message }
    })
end

local function isFeatureEnabled(featureName)
    return type(Config.features[featureName]) == 'table' and Config.features[featureName].enabled == true
end

local function isDriver(ped, vehicle)
    return GetPedInVehicleSeat(vehicle, -1) == ped
end

local function checkCooldown(featureName, seconds)
    if not seconds or seconds <= 0 then
        return true
    end

    local now = GetGameTimer()
    local expiresAt = clientCooldowns[featureName] or 0

    if expiresAt > now then
        notify(('Please wait %s more seconds before using this again.'):format(math.ceil((expiresAt - now) / 1000)))
        return false
    end

    clientCooldowns[featureName] = now + (seconds * 1000)
    return true
end

local function getVehicleForCommand(feature)
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)

    if vehicle == 0 then
        notify(Config.messages.notInVehicle)
        return nil, nil
    end

    if feature.requireDriver and not isDriver(ped, vehicle) then
        notify(Config.messages.notDriver)
        return nil, nil
    end

    return ped, vehicle
end

local function revivePed(ped, health)
    local coords = GetEntityCoords(ped)

    NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, GetEntityHeading(ped), true, false)
    ClearPedBloodDamage(ped)
    ClearPedTasksImmediately(ped)
    SetEntityHealth(ped, health)
end

RegisterNetEvent('danielilli:client:repairVehicle', function()
    if not isFeatureEnabled('repair') then
        notify(Config.messages.featureDisabled)
        return
    end

    local feature = Config.features.repair
    if not checkCooldown('repair', feature.cooldownSeconds) then
        return
    end

    local _, vehicle = getVehicleForCommand(feature)
    if not vehicle then
        return
    end

    if feature.repairEngine then
        SetVehicleEngineHealth(vehicle, 1000.0)
    end

    if feature.repairBody then
        SetVehicleFixed(vehicle)
    end

    if feature.cleanVehicle then
        SetVehicleDirtLevel(vehicle, 0.0)
        WashDecalsFromVehicle(vehicle, 1.0)
    end

    SetVehiclePetrolTankHealth(vehicle, 1000.0)
    notify(Config.messages.vehicleRepaired)
end)

RegisterNetEvent('danielilli:client:cleanVehicle', function()
    if not isFeatureEnabled('clean') then
        notify(Config.messages.featureDisabled)
        return
    end

    local feature = Config.features.clean
    if not checkCooldown('clean', feature.cooldownSeconds) then
        return
    end

    local _, vehicle = getVehicleForCommand(feature)
    if not vehicle then
        return
    end

    SetVehicleDirtLevel(vehicle, 0.0)
    WashDecalsFromVehicle(vehicle, 1.0)
    notify(Config.messages.vehicleCleaned)
end)

RegisterNetEvent('danielilli:client:revive', function()
    if not isFeatureEnabled('revive') then
        notify(Config.messages.featureDisabled)
        return
    end

    local feature = Config.features.revive
    if not checkCooldown('revive', feature.cooldownSeconds) then
        return
    end

    revivePed(PlayerPedId(), feature.reviveHealth)
    notify(Config.messages.revived)
end)

RegisterNetEvent('danielilli:client:notify', notify)

RegisterNetEvent('danielilli:client:announce', function(message)
    notify(('%s %s'):format(Config.features.announcements.prefix, Danielilli.trim(message)))
end)

CreateThread(function()
    Wait(3000)

    if Config.features.joinMessage.enabled then
        notify(Config.features.joinMessage.message)
    end
end)
