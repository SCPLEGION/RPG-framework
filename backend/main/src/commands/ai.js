import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import AIClient from '../../utils/ai.js';

export const data = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('Ask the AI a question')
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Your question for the AI')
      .setRequired(true)
  ).addBooleanOption(option =>
    option.setName("debug").setDescription("digidong")
  )
  .setContexts([0, 1, 2]);

export async function execute(interaction) {
  const question = interaction.options.getString('question');
  const debug = interaction.options.getBoolean('debug');
  await interaction.deferReply();
  const ai = new AIClient();
  try {
    const response = await ai.chatCompletion([
      { role: 'system', content: 'You are a helpful assistant. Pomagasz graczom na serverze swem o nazwie heavens stables masz na imie andrzej, pomagasz graczom zacząć gre na serwerze używając informacji podanych tobie, Nie dodawaj informacji nie zawartch w dane' },
      { role: 'user', content: question }
    ]);

    const content = response.choices[0].message.content;
    const buffer = Buffer.from(content, 'utf-8');
    const file = new AttachmentBuilder(buffer, { name: 'response.txt' });

    await interaction.editReply({ content: 'Odpowiedź AI:', files: [file] });
  } catch (err) {
    if (debug) {
        await interaction.editReply(`Sorry, I could not process your request at this time. ${err}`);
    } else {
        await interaction.editReply('Sorry, I could not process your request at this time.');
    }
  }
}
