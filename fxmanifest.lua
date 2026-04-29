fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Danielilli Scripts'
description 'Standalone FiveM script bundle with a modern NUI control panel.'
version '0.1.0'

ui_page 'web/index.html'

shared_scripts {
    'config/settings.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

files {
    'web/index.html',
    'web/style.css',
    'web/app.js'
}
