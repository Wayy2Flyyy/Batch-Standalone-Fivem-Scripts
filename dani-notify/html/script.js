const container = document.getElementById('notification-container');

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action !== 'notify') return;

    container.className = data.position || 'top-right';

    const color = (data.colors && data.colors[data.type]) || '#3498db';
    const duration = data.duration || 5000;

    const el = document.createElement('div');
    el.className = 'notification';
    el.style.backgroundColor = 'rgba(20, 20, 30, 0.85)';
    el.style.borderLeftColor = color;
    el.textContent = data.message;

    const progress = document.createElement('div');
    progress.className = 'progress';
    progress.style.width = '100%';
    progress.style.transition = `width ${duration}ms linear`;
    el.appendChild(progress);

    container.appendChild(el);

    requestAnimationFrame(() => {
        progress.style.width = '0%';
    });

    setTimeout(() => {
        el.classList.add('removing');
        setTimeout(() => el.remove(), 300);
    }, duration);
});
