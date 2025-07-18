import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import AIClient from '../../utils/ai.js'; // Twój AIClient

const TTS_API_URL = 'https://api.cartesia.ai/tts/bytes';
const TTS_API_KEY = 'sk_car_Ww45j9k5GPHp6pjKLCHE38';

export const data = new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Wygeneruj mowę z tekstu i odtwórz ją na kanale głosowym')
    .addStringOption(option =>
        option.setName('tekst')
            .setDescription('Tekst do przeczytania')
            .setRequired(true)
    )
    .setContexts([0,1,2])

export async function execute(interaction) {
    const tekst = interaction.options.getString('tekst');
    const member = interaction.member;

    if (!member.voice?.channel) {
        await interaction.reply({ content: 'Musisz być na kanale głosowym!', ephemeral: true });
        return;
    }

    await interaction.deferReply();

    // Token-efficient, concise system prompt
    const systemPrompt = 'Jesteś Andrzej, pomocny asystent serwera Heavens Stables. Odpowiadaj krótko, tylko na podstawie podanych informacji.';

    // Truncate user input if too long (e.g., 400 chars)
    const trimmedTekst = tekst.length > 400 ? tekst.slice(0, 400) : tekst;

    // Optionally, keep a short chat log or summary for context (here, just the latest user input)
    let ai = new AIClient();
    let response = await ai.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: trimmedTekst }
    ])

    // ZAPYTANIE DO API TTS
    let audioBuffer;
    try {
        const ttsResponse = await axios.post(
            TTS_API_URL,
            {
                model_id: "sonic-2",
                transcript: response.choices[0].message.content,
                voice: {
                    mode: "id",
                    id: "4ef93bb3-682a-46e6-b881-8e157b6b4388"
                },
                output_format: {
                    container: "wav",
                    encoding: "pcm_f32le",
                    sample_rate: 44100
                },
                language: "pl"
            },
            {
                headers: {
                    "Cartesia-Version": "2024-06-10",
                    "X-API-Key": TTS_API_KEY,
                    "Content-Type": "application/json"
                },
                responseType: "arraybuffer"
            }
        );
        audioBuffer = ttsResponse.data;
    } catch (err) {
        console.error(err);
        await interaction.editReply('Błąd podczas generowania audio.');
        return;
    }

    // ZAPIS DO PLIKU
    const audioFile = path.resolve(`./tts_${Date.now()}.wav`);
    fs.writeFileSync(audioFile, audioBuffer);

    // DOŁĄCZANIE NA KANAŁ GŁOSOWY
    const channel = member.voice.channel;
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
    });

    // ODTWARZANIE AUDIO
    const player = createAudioPlayer();
    const resource = createAudioResource(audioFile);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        fs.unlink(audioFile, () => {});
    });
    player.on('error', err => {
        console.error(err);
        connection.destroy();
        fs.unlink(audioFile, () => {});
    });

    await interaction.editReply('Odtwarzam wiadomość na kanale głosowym!');
}