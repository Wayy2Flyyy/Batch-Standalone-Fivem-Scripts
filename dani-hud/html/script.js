const hudContainer = document.getElementById('hud-container');
const healthBar = document.getElementById('health-bar');
const armorBar = document.getElementById('armor-bar');
const staminaBar = document.getElementById('stamina-bar');
const healthWrapper = document.getElementById('health-bar-wrapper');
const armorWrapper = document.getElementById('armor-bar-wrapper');
const staminaWrapper = document.getElementById('stamina-bar-wrapper');

window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === 'updateHud') {
        healthWrapper.style.display = data.showHealth ? 'flex' : 'none';
        armorWrapper.style.display = data.showArmor ? 'flex' : 'none';
        staminaWrapper.style.display = data.showStamina ? 'flex' : 'none';

        healthBar.style.width = data.health + '%';
        healthBar.style.backgroundColor = data.healthColor;

        armorBar.style.width = data.armor + '%';
        armorBar.style.backgroundColor = data.armorColor;

        staminaBar.style.width = data.stamina + '%';
        staminaBar.style.backgroundColor = data.staminaColor;
    }

    if (data.action === 'toggleHud') {
        hudContainer.style.opacity = data.visible ? '1' : '0';
    }
});
