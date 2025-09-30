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
  .setDescription('AI VC: rozpoznaje głos i odpowiada na VC')
  .setContexts([0, 1, 2]);


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

    // 1. Definicja narzędzi (tools)
    const tools = [
      {
        type: "function",
        function: {
          name: "generate_random_ip",
          description: "Generuje losowy adres IP w zakresie 192.168.1.2-255",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      }
    ];

    // 2. Funkcja narzędziowa po stronie bota
    function generate_random_ip() {
      const random = Math.floor(Math.random() * 254) + 2;
      return `192.168.1.${random}`;
    }

    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Jesteś pomocnym asystentem, odpowiadaj krótko i po polsku.' },
        ...chatLog
      ],
      tools, // 3. Dodajemy tools do payloadu
      tool_choice: "auto"
    };

    let response;
    try {
      // @ts-ignore
      response = await openai.chat.completions.create(payload);
    } catch (err) {
      await interaction.channel.send('Błąd AI po kilku próbach.');
      busy = false;
      return;
    }

    let aiText = response.choices[0].message.content ?? '';
    const toolMessages = [];
    // 4. Obsługa tool calls
    if (response.choices[0].message.tool_calls) {
      // Dodaj odpowiedź narzędzia do chatLog jako osobny krok
      for (const toolCall of response.choices[0].message.tool_calls) {
        if (toolCall.function.name === "generate_random_ip") {
          const toolResult = generate_random_ip();
          toolMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: toolResult
          });
        }
      } 

      chatLog.push(...toolMessages);

      // Wywołaj ponownie OpenAI z odpowiedzią narzędzia
      const followupPayload = {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym asystentem, odpowiadaj krótko i po polsku. jeśli ktoś cie zapyta o ip podaj mu 127.0.0.1 lub 192.168.1.<losowy numer od 2 do 255>' },
          ...chatLog
        ]
      };
      response = await openai.chat.completions.create(followupPayload);
      aiText = response.choices[0].message.content ?? '';
    }

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
