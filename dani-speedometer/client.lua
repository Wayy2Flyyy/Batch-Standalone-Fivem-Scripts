local inVehicle = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(Config.UpdateInterval)

        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)

        if vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == ped then
            if not inVehicle then
                inVehicle = true
                SendNUIMessage({ action = 'show' })
            end

            local speedRaw = GetEntitySpeed(vehicle)
            local speed = 0
            if Config.Unit == 'mph' then
                speed = math.floor(speedRaw * 2.236936)
            else
                speed = math.floor(speedRaw * 3.6)
            end

            local rpm = GetVehicleCurrentRpm(vehicle)
            local gear = GetVehicleCurrentGear(vehicle)
            local fuel = GetVehicleFuelLevel(vehicle)

            SendNUIMessage({
                action    = 'update',
                speed     = speed,
                unit      = Config.Unit,
                gear      = gear,
                rpm       = math.floor(rpm * 100),
                fuel      = math.floor(fuel),
                showGear  = Config.ShowGear,
                showFuel  = Config.ShowFuel,
                showRPM   = Config.ShowRPM,
                speedColor = Config.SpeedColor,
                rpmColor   = Config.RPMColor,
                fuelColor  = Config.FuelColor,
            })
        else
            if inVehicle then
                inVehicle = false
                SendNUIMessage({ action = 'hide' })
            end
        end
    end
end)
