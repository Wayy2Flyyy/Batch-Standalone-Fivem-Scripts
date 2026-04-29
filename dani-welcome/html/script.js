const overlay = document.getElementById('welcome-overlay');
const serverName = document.getElementById('server-name');
const greeting = document.getElementById('greeting');
const welcomeMessage = document.getElementById('welcome-message');
const accent = document.querySelector('.welcome-accent');

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action !== 'showWelcome') return;

    serverName.textContent = data.serverName;
    greeting.textContent = 'Welcome, ' + (data.playerName || 'Player') + '!';
    welcomeMessage.textContent = data.message;
    accent.style.backgroundColor = data.accentColor;

    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, data.duration || 8000);
});
