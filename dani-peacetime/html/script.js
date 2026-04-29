const badge = document.getElementById('peacetime-badge');
const badgeText = document.getElementById('badge-text');
const badgeDot = document.querySelector('.badge-dot');

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action !== 'updateState') return;

    badgeText.textContent = data.message;
    badgeDot.style.backgroundColor = data.color;

    if (data.state === 'normal') {
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
    }
});
