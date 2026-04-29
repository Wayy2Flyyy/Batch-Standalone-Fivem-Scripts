local noclipActive = false
local noclipCam = nil

if Config.Commands.heal then
    RegisterNetEvent('dani-commands:heal')
    AddEventHandler('dani-commands:heal', function()
        local ped = PlayerPedId()
        SetEntityHealth(ped, GetEntityMaxHealth(ped))
    end)
end

if Config.Commands.armor then
    RegisterNetEvent('dani-commands:armor')
    AddEventHandler('dani-commands:armor', function()
        SetPedArmour(PlayerPedId(), 100)
    end)
end

if Config.Commands.coords then
    RegisterCommand('coords', function()
        local pos = GetEntityCoords(PlayerPedId())
        local heading = GetEntityHeading(PlayerPedId())
        local text = string.format('vector4(%.2f, %.2f, %.2f, %.2f)', pos.x, pos.y, pos.z, heading)
        TriggerEvent('chat:addMessage', {
            color = {52, 152, 219},
            args = {'Coords', text}
        })
    end, false)
end

if Config.Commands.noclip then
    RegisterNetEvent('dani-commands:noclip')
    AddEventHandler('dani-commands:noclip', function()
        noclipActive = not noclipActive
        local ped = PlayerPedId()
        SetEntityVisible(ped, not noclipActive, false)
        SetEntityCollision(ped, not noclipActive, not noclipActive)
        FreezeEntityPosition(ped, noclipActive)
        SetEntityInvincible(ped, noclipActive)

        if noclipActive then
            Citizen.CreateThread(function()
                while noclipActive do
                    Citizen.Wait(0)
                    local camRot = GetGameplayCamRot(2)
                    local camFor = RotationToDirection(camRot)
                    local pos = GetEntityCoords(ped)
                    local speed = 1.0

                    if IsControlPressed(0, 21) then speed = 3.0 end

                    if IsControlPressed(0, 32) then
                        pos = pos + camFor * speed
                    end
                    if IsControlPressed(0, 33) then
                        pos = pos - camFor * speed
                    end
                    if IsControlPressed(0, 34) then
                        pos = pos - vector3(-camFor.y, camFor.x, 0.0) * speed
                    end
                    if IsControlPressed(0, 35) then
                        pos = pos + vector3(-camFor.y, camFor.x, 0.0) * speed
                    end

                    SetEntityCoordsNoOffset(ped, pos.x, pos.y, pos.z, true, true, true)
                end
            end)
        end
    end)
end

function RotationToDirection(rot)
    local rz = math.rad(rot.z)
    local rx = math.rad(rot.x)
    return vector3(
        -math.sin(rz) * math.abs(math.cos(rx)),
        math.cos(rz) * math.abs(math.cos(rx)),
        math.sin(rx)
    )
end

if Config.Commands.dv then
    RegisterNetEvent('dani-commands:dv')
    AddEventHandler('dani-commands:dv', function()
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if vehicle == 0 then
            vehicle = GetClosestVehicle(GetEntityCoords(ped), 5.0, 0, 71)
        end
        if vehicle ~= 0 then
            DeleteEntity(vehicle)
        end
    end)
end

if Config.Commands.car then
    RegisterNetEvent('dani-commands:car')
    AddEventHandler('dani-commands:car', function(model)
        local hash = GetHashKey(model)
        RequestModel(hash)
        local timeout = 0
        while not HasModelLoaded(hash) and timeout < 50 do
            Citizen.Wait(100)
            timeout = timeout + 1
        end
        if HasModelLoaded(hash) then
            local ped = PlayerPedId()
            local pos = GetEntityCoords(ped)
            local heading = GetEntityHeading(ped)
            local vehicle = CreateVehicle(hash, pos.x, pos.y, pos.z, heading, true, false)
            TaskWarpPedIntoVehicle(ped, vehicle, -1)
            SetModelAsNoLongerNeeded(hash)
        end
    end)
end

RegisterNetEvent('dani-commands:teleport')
AddEventHandler('dani-commands:teleport', function(x, y, z)
    SetEntityCoords(PlayerPedId(), x + 0.0, y + 0.0, z + 0.0, false, false, false, true)
end)
