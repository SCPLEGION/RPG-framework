import { SlashCommandBuilder, AttachmentBuilder,Typing } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('getinfo')
  .setDescription('Get info')
  .addMentionableOption(option =>
    option.setName('user')
      .setDescription('The user to get info about')
      .setRequired(true)
  )
  .setContexts([0, 1, 2]);

export async function execute(interaction) {
    const mentionable = interaction.options.getMentionable('user');
    if (!mentionable) return interaction.reply('User not found.');

    // Jeśli to GuildMember
    if (mentionable.send) {
        await mentionable.send('ale cwel');
        await interaction.reply('Wysłano wiadomość do użytkownika.');
    } else if (mentionable.user && mentionable.user.send) {
        await mentionable.user.send('ale cwel');
        await interaction.reply('Wysłano wiadomość do użytkownika.');
    } else {
        await interaction.reply('Nie można wysłać wiadomości do tego obiektu.');
    }
}
