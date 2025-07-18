import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  EndBehaviorType,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from '@discordjs/voice';
import fs from 'fs';
import path from 'path';
import prism from 'prism-media';
import { spawn } from 'child_process';
import { mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { OpenAI } from 'openai';

const TARGET_USER_ID = '552543606012117012';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const data = new SlashCommandBuilder()
  .setName('ai_vc')
  .setDescription('AI VC: rozpoznaje głos i odpowiada na VC');

async function askOpenAIWithRetry(payload, retries = 2, delay = 1000) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await openai.chat.completions.create(payload);
      return response;
    } catch (err) {
      console.error("Błąd AI:", err);
    }
    attempt++;
    console.warn(`Retry attempt ${attempt}`);
    await new Promise(r => setTimeout(r, delay));
  }
  throw new Error("Nie udało się uzyskać odpowiedzi od AI po wielu próbach.");
}

export async function execute(interaction) {
  const member = interaction.member;

  if (!member.voice?.channel) {
    await interaction.reply({ content: 'Musisz być na kanale głosowym!', ephemeral: true });
    return;
  }

  await interaction.deferReply();

  const channel = member.voice.channel;
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  const receiver = connection.receiver;
  const dir = './recordings';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  let busy = false;
  let active = true;
  let chatLog = [];

  receiver.speaking.on('start', async (userId) => {
    if (busy || userId !== TARGET_USER_ID || !active) return;
    busy = true;

    const opusStream = receiver.subscribe(userId, {
      end: { behavior: EndBehaviorType.AfterSilence, duration: 1000 },
    });

    const files = readdirSync(dir).filter(file => file.startsWith(`recorded-${userId}-`) && file.endsWith('.wav'));
    const wavFile = join(dir, `recorded-${userId}-${files.length + 1}.wav`);

    const decoder = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
    const ffmpeg = spawn('ffmpeg', ['-f', 's16le', '-ar', '48000', '-ac', '2', '-i', 'pipe:0', wavFile]);

    opusStream.pipe(decoder).pipe(ffmpeg.stdin);

    await new Promise((resolve) => ffmpeg.on('close', resolve));

    let transcriptText = '';
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(wavFile),
        model: 'whisper-1',
        language: 'pl'
      });
      transcriptText = transcription.text;
      chatLog.push({ role: 'user', content: transcriptText });
      await interaction.channel.send(`STT: ${transcriptText}`);
    } catch (err) {
      console.error(err);
      await interaction.channel.send('Błąd transkrypcji.');
      busy = false;
      unlinkSync(wavFile);
      return;
    }

    unlinkSync(wavFile);

    if (transcriptText.toLowerCase().includes('zakończ rozmowę.')) {
      active = false;
      await interaction.channel.send('Rozmowa zakończona. Rozłączam się.');
      chatLog = [];
      connection.destroy();
      busy = false;
      return;
    }

    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Jesteś pomocnym asystentem, odpowiadaj krótko i po polsku.' },
        ...chatLog
      ],

    };

    let response;
    try {
      response = await askOpenAIWithRetry(payload, 2);
    } catch (err) {
      await interaction.channel.send('Błąd AI po kilku próbach.');
      busy = false;
      return;
    }

    let aiText = response.choices[0].message.content ?? '';

    // Obsługa tool calls

    if (!aiText && !response.choices[0].message.tool_calls) {
      await interaction.channel.send('Brak odpowiedzi od AI.');
      busy = false;
      return;
    }

    chatLog.push({ role: 'assistant', content: aiText });

    async function gentts() {
      let audioBuffer;
      try {
        const ttsResponse = await openai.audio.speech.create({
          model: "gpt-4o-mini-tts",
          input: aiText,
          voice: "onyx",
          instructions: "Rozmawiasz po polsku."
        });
        audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
      } catch (err) {
        console.error(err);
        await interaction.channel.send('Błąd TTS.');
        connection.destroy();
        busy = false;
        return;
      }

      const audioFile = path.resolve(`./tts_${Date.now()}.mp3`);
      fs.writeFileSync(audioFile, audioBuffer);

      const player = createAudioPlayer();
      const resource = createAudioResource(audioFile);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        unlinkSync(audioFile);
        busy = false;
      });

      player.on('error', err => {
        console.error(err);
        unlinkSync(audioFile);
        busy = false;
      });

      await interaction.channel.send(`AI: ${aiText}`);
    }

    if (aiText) {
      await gentts();
    } else {
      busy = false;
    }
  });

  receiver.speaking.on('end', (userId) => {
    if (userId !== TARGET_USER_ID) return;
    console.log(`Koniec nagrania: ${userId}`);
  });
}
