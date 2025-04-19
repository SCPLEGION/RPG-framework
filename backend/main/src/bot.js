import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { redirect, handleInteraction } from './modules/redirector.js';
import { querry } from './modules/database.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guild = client.guilds.cache.get("1353825315117334668");
    if (guild) {
        console.log(`Guild: ${guild.name}`);
        try {
            const members = await guild.members.fetch();
            members.forEach(member => {
                savetodb(member.user)
            });
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    } else {
        console.error("Guild not found.");
    }
    fetchavatar("1129748154506551336").then((x) => {
        console.log("test",x);
    });
});

async function savetodb(x) {
    const { id, username, discriminator } = x;
    await querry(
        `INSERT INTO users (id, username, discriminator, role, token) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET username = ?, discriminator = ?`,
        [id, username, discriminator, 'user', 0, username, discriminator]
    );
}


client.on('messageCreate', (message) => {
    redirect(message);
});

client.on('interactionCreate', (interaction) => {
    handleInteraction(interaction);
});

export function sendmsg(channelId, msg) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        channel.send(msg);
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
    
}

export async function fetchavatar(userId) {
    try {
        const guilds = client.guilds.cache;
        for (const guild of guilds.values()) {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
                return member.user.displayAvatarURL();
            }
        }
        throw new Error("User not found in any guild.");
    } catch (error) {
        console.error("Error fetching avatar:", error);
        return null;
    }
}

export async function action(x,y){
    
}


client.login(process.env.DISCORD_TOKEN);
