import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  EndBehaviorType
} from '@discordjs/voice';
import * as prism from 'prism-media';
import { spawn } from 'child_process';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const data = new SlashCommandBuilder()
  .setName('voicedebug')
  .setDescription('Nagrywa i zapisuje WAV z numeracją!');

export async function execute(interaction) {
  const member = interaction.member;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply({ content: 'Musisz być na kanale głosowym!', flags: 64 });
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
  } catch {
    return interaction.reply({ content: 'Nie udało się dołączyć do kanału.', flags: 64 });
  }

  const receiver = connection.receiver;
  const dir = './recordings';
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  receiver.speaking.on('start', (userId) => {
    const opusStream = receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000,
      },
    });

    // Automatyczne nadawanie numeru
    const files = readdirSync(dir).filter(file => file.startsWith(`recorded-${userId}-`) && file.endsWith('.wav'));
    const nextIndex = files.length + 1;

    const wavFile = join(dir, `recorded-${userId}-${nextIndex}.wav`);

    const decoder = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });

    const ffmpeg = spawn('ffmpeg', [
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2',
      '-i', 'pipe:0',
      wavFile,
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Plik WAV zapisany: ${wavFile}`);
      } else {
        console.error(`❌ ffmpeg zakończony z kodem ${code}`);
      }
    });

    opusStream.pipe(decoder).pipe(ffmpeg.stdin);
  });

  await interaction.reply({ content: '🎙️ Rozpoczęto nagrywanie i numerowanie plików WAV!', flags: 64 });
}
