fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Danielilli Scripts'
description 'Standalone FiveM utility resource with configurable welcome and server info features.'
version '0.1.0'

shared_scripts {
    'shared/config.lua',
    'shared/utils.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}
