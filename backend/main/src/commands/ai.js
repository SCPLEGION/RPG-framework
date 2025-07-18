import { SlashCommandBuilder } from 'discord.js';
import AIClient from '../../utils/ai.js';

export const data = new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Ask the AI a question')
    .addStringOption(option =>
        option.setName('question')
            .setDescription('Your question for the AI')
            .setRequired(true)
    )
    .setContexts([0,1,2])

export async function execute(interaction) {
    const question = interaction.options.getString('question');
    await interaction.deferReply();
    let ai = new AIClient
    let response = await ai.chatCompletion([
        { role: 'system', content: 'You are a helpful assistant. Pomagasz graczom na serverze swem o nazwie heavens stables masz na imie andrzej, pomagasz graczom zacząć gre na serwerze używając informacji podanych tobie, Nie dodawaj informacji nie zawartch w dane' },
        { role: 'user', content: question }
    ])
    if (response){
        await interaction.editReply(response.choices[0].message.content);
    } else {
        await interaction.editReply('Sorry, I could not process your request at this time.');
    }
}