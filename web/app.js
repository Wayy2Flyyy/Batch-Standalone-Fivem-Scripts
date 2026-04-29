(function () {
    const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'danielilli_scripts';
    const panel = document.querySelector('[data-panel]');
    const closeButton = document.querySelector('[data-action="close"]');
    const title = document.querySelector('[data-title]');
    const subtitle = document.querySelector('[data-subtitle]');
    const statusText = document.querySelector('[data-status-text]');
    const resourceNameText = document.querySelector('[data-resource-name]');
    const commandText = document.querySelector('[data-command]');
    const actionsContainer = document.querySelector('[data-actions]');

    function setVisible(visible) {
        document.body.classList.toggle('is-visible', visible);
    }

    async function postNui(eventName, payload) {
        try {
            await fetch(`https://${resourceName}/${eventName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(payload || {}),
            });
        } catch (error) {
            // Browser preview mode has no FiveM NUI bridge; keep the UI usable for local review.
            console.warn(`NUI callback "${eventName}" failed`, error);
        }
    }

    if (closeButton) {
        closeButton.addEventListener('click', function () {
            postNui('close');
            setVisible(false);
        });
    }

    function renderActions(actions) {
        if (!actionsContainer || !Array.isArray(actions)) {
            return;
        }

        actionsContainer.innerHTML = '';

        actions.forEach(function (action) {
            const button = document.createElement('button');
            button.className = 'action-card';
            button.type = 'button';
            button.innerHTML = `
                <span>${action.label || action.id}</span>
                <small>${action.description || ''}</small>
            `;
            button.addEventListener('click', function () {
                postNui('runAction', { id: action.id });
            });
            actionsContainer.appendChild(button);
        });
    }

    function applyConfig(config) {
        if (!config) {
            return;
        }

        if (title && config.title) {
            title.textContent = config.title;
        }

        if (subtitle && config.subtitle) {
            subtitle.textContent = config.subtitle;
        }

        if (statusText && config.resourceName) {
            statusText.textContent = `${config.resourceName} is loaded and ready.`;
        }

        if (resourceNameText && config.resourceName) {
            resourceNameText.textContent = config.resourceName;
        }

        if (commandText && config.commandName) {
            commandText.textContent = `/${config.commandName}`;
        }

        if (panel && config.accentColor) {
            panel.style.setProperty('--accent', config.accentColor);
        }

        renderActions(config.actions);
    }

    window.addEventListener('message', function (event) {
        const data = event.data || {};

        if (data.action === 'setConfig') {
            applyConfig(data);
        }

        if (data.action === 'open') {
            setVisible(true);
        }

        if (data.action === 'close') {
            setVisible(false);
        }
    });

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            postNui('close');
            setVisible(false);
        }
    });

    postNui('ready');

    if (!window.invokeNative && panel) {
        setVisible(true);
    }
}());
