local isHudVisible = true

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(Config.UpdateInterval)

        local ped = PlayerPedId()

        if Config.HideInVehicle and IsPedInAnyVehicle(ped, false) then
            if isHudVisible then
                SendNUIMessage({ action = 'toggleHud', visible = false })
                isHudVisible = false
            end
        else
            if not isHudVisible then
                SendNUIMessage({ action = 'toggleHud', visible = true })
                isHudVisible = true
            end

            local health = GetEntityHealth(ped) - 100
            if health < 0 then health = 0 end
            local maxHealth = GetEntityMaxHealth(ped) - 100
            if maxHealth < 1 then maxHealth = 1 end

            local armor = GetPedArmour(ped)
            local stamina = 100.0 - GetPlayerSprintStaminaRemaining(PlayerId())

            SendNUIMessage({
                action = 'updateHud',
                health = math.floor((health / maxHealth) * 100),
                armor = armor,
                stamina = math.floor(stamina),
                showHealth = Config.ShowHealth,
                showArmor = Config.ShowArmor,
                showStamina = Config.ShowStamina,
                healthColor = Config.HealthColor,
                armorColor = Config.ArmorColor,
                staminaColor = Config.StaminaColor,
            })
        end
    end
end)
