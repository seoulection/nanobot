require('dotenv').config();
const tmi = require('tmi.js');

const nanoApi = require('./nanoApi');

const COMMANDS = [
  '!nanorando (set a random effect)',
  '!nano effects (list all effects)',
  '!nano selected (currently selected effect)',
  '!nano set <effect> (set an effect)'
];

const OPTS = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_PASSWORD
  },
  channels: [
    process.env.TWITCH_CHANNEL
  ]
};

const client = new tmi.client(OPTS);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

async function onMessageHandler(target, context, message, self) {
  if (self) return;

  const commandString = message.split(' ');
  const command = commandString[0];

  switch (command) {
    case '!commands':
      const commands = COMMANDS.join(', ');
      client.say(target, `Valid commands: ${commands}`);
      break;

    case '!nanorando':
      const effect = await nanoApi.getRandomEffect();
      await nanoApi.setEffect(effect);
      client.say(target, `Random effect (${effect}) applied`);

      break;

    case '!nano':
      const wordArray = commandString.slice(1);
      const subCommand = wordArray[0];

      if (subCommand === 'effects') {
        const effectsList = await nanoApi.getEffectsList();
        client.say(target, `Effects list: ${effectsList}`);
      } else if (subCommand === 'selected') {
        const selectedEffect = await nanoApi.getSelectedEffect();
        client.say(target, `Selected effect: ${selectedEffect}`);
      } else if (subCommand === 'set') {
        const effect = wordArray.slice(1).filter(n => n).join(' ');

        const data = await nanoApi.setEffect(effect);

        if (data) {
          client.say(target, `Effect (${effect}) applied`);
        } else {
          client.say(target, 'Invalid effect');
        }
      } else {
        client.say(target, 'Unknown command');
      }

      break;

    default:
      client.say(target, 'Unknown command')
  }
}

function onConnectedHandler(address, port) {
  console.log(`Connected to ${address}:${port}`);
}

function removeExtraWhitespace(str) {
  return str.replace(/\s+/g, ' ').trim();
}
