const speedometer = document.getElementById('speedometer');
const speedValue = document.getElementById('speed-value');
const speedUnit = document.getElementById('speed-unit');
const gearValue = document.getElementById('gear-value');
const gearDisplay = document.getElementById('gear-display');
const rpmBar = document.getElementById('rpm-bar');
const rpmDisplay = document.getElementById('rpm-display');
const fuelBar = document.getElementById('fuel-bar');
const fuelDisplay = document.getElementById('fuel-display');

window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.action === 'show') {
        speedometer.classList.remove('hidden');
    }

    if (data.action === 'hide') {
        speedometer.classList.add('hidden');
    }

    if (data.action === 'update') {
        speedValue.textContent = data.speed;
        speedValue.style.color = data.speedColor;
        speedUnit.textContent = data.unit;

        gearDisplay.style.display = data.showGear ? 'block' : 'none';
        gearValue.textContent = data.gear === 0 ? 'R' : data.gear;

        rpmDisplay.style.display = data.showRPM ? 'block' : 'none';
        rpmBar.style.width = data.rpm + '%';
        rpmBar.style.backgroundColor = data.rpmColor;

        fuelDisplay.style.display = data.showFuel ? 'block' : 'none';
        fuelBar.style.width = data.fuel + '%';
        fuelBar.style.backgroundColor = data.fuelColor;
    }
});
