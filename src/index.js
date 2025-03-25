import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { redirect } from './modules/redirector.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    redirect(message);
});

client.login(process.env.DISCORD_TOKEN);