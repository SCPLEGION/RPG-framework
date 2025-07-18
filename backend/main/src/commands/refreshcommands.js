import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes, Collection } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('refreshcommands')
    .setDescription('Odświeża/rejestruje ponownie komendy slash (tylko admin)')
    .setContexts([0,1,2]);

export async function execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
        return interaction.reply({ content: 'Brak uprawnień.', ephemeral: true });
    }

    const commands = [];
    const commandsMap = new Collection();
    const commandsPath = path.join(process.cwd(), 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // @ts-ignore
        const command = await import(`file://${filePath}`);
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
            commandsMap.set(command.data.name, command);
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands('1354223087486505010'),
            { body: commands }
        );
        await interaction.reply({ content: `Odświeżono ${commands.length} komend.`, ephemeral: true });
    } catch (error) {
        console.error('Error refreshing slash commands:', error);
        await interaction.reply({ content: 'Błąd podczas odświeżania komend.', ephemeral: true });
    }
}