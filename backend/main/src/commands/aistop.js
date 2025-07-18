import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName('stop_ai_vc')
  .setDescription('Rozłącza bota z VC i wyłącza słuchanie');

export async function execute(interaction) {
  const connection = getVoiceConnection(interaction.guild.id);

  if (connection) {
    connection.destroy();
    await interaction.reply('🛑 Bot rozłączony z VC!');
  } else {
    await interaction.reply('❌ Bot nie jest na żadnym VC.');
  }
};
