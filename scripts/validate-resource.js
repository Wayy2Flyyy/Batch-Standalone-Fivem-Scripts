#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const resourceDir = path.join(root, 'danielilli_standalone');

const requiredFiles = [
  'fxmanifest.lua',
  'shared/config.lua',
  'shared/utils.lua',
  'client/main.lua',
  'server/main.lua',
];

const errors = [];

function read(relativePath) {
  const fullPath = path.join(resourceDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
    return '';
  }

  return fs.readFileSync(fullPath, 'utf8');
}

function assertContains(file, content, expected) {
  if (!content.includes(expected)) {
    errors.push(`${file} is missing expected content: ${expected}`);
  }
}

for (const file of requiredFiles) {
  read(file);
}

const manifest = read('fxmanifest.lua');
assertContains('fxmanifest.lua', manifest, "fx_version 'cerulean'");
assertContains('fxmanifest.lua', manifest, "game 'gta5'");
assertContains('fxmanifest.lua', manifest, "lua54 'yes'");

for (const file of requiredFiles.slice(1)) {
  const content = read(file);
  if (/\t/.test(content)) {
    errors.push(`${file} contains tabs; use spaces for consistent Lua formatting`);
  }
  if (/\r\n/.test(content)) {
    errors.push(`${file} uses CRLF line endings; use LF`);
  }
}

const config = read('shared/config.lua');
for (const command of ['help', 'repair', 'clean', 'revive', 'announce']) {
  assertContains('shared/config.lua', config, `${command} =`);
}

const client = read('client/main.lua');
for (const event of [
  'danielilli:client:notify',
  'danielilli:client:revive',
  'danielilli:client:repairVehicle',
  'danielilli:client:cleanVehicle',
]) {
  assertContains('client/main.lua', client, event);
}

const server = read('server/main.lua');
for (const command of [
  'RegisterCommand(Config.commands.help',
  'RegisterCommand(Config.commands.repair',
  'RegisterCommand(Config.commands.clean',
  'RegisterCommand(Config.commands.announce',
  'RegisterCommand(Config.commands.revive',
  'IsPlayerAceAllowed',
]) {
  assertContains('server/main.lua', server, command);
}

if (errors.length > 0) {
  console.error('Resource validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Resource validation passed.');
