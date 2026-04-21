import path from 'node:path';
import fs from 'node:fs';
import { runCommand } from '../utils/command.js';

const outputDir = path.resolve(process.cwd(), 'backend', 'data', 'artifacts');
fs.mkdirSync(outputDir, { recursive: true });

export async function generateTextWithOllama(prompt) {
  const sanitized = prompt.replace(/"/g, '\\"');
  return runCommand(`ollama run llama3.1 \"${sanitized}\"`);
}

export async function generateAudioWithCoqui(text, projectId, platform) {
  const file = path.join(outputDir, `project-${projectId}-${platform}-${Date.now()}.wav`);
  const escaped = text.replace(/"/g, '\\"');
  await runCommand(`tts --text \"${escaped}\" --out_path \"${file}\"`);
  return file;
}

export async function generateImageWithStableDiffusion(prompt, projectId, platform) {
  const file = path.join(outputDir, `project-${projectId}-${platform}-${Date.now()}.png`);
  const escaped = prompt.replace(/"/g, '\\"');
  await runCommand(`python backend/scripts/sd_generate.py --prompt \"${escaped}\" --output \"${file}\"`);
  return file;
}

export async function renderVideoWithFFmpeg({ audioPath, imagePath, text, projectId, platform }) {
  const output = path.join(outputDir, `project-${projectId}-${platform}-${Date.now()}.mp4`);
  const escapedText = text.replace(/:/g, '\\:').replace(/'/g, "\\'");

  const ffmpegCmd = [
    'ffmpeg -y',
    `-loop 1 -i \"${imagePath}\"`,
    `-i \"${audioPath}\"`,
    '-vf "scale=1080:1920,format=yuv420p,drawtext=text=\'' + escapedText + '\':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h-250"',
    '-shortest',
    `\"${output}\"`
  ].join(' ');

  await runCommand(ffmpegCmd);
  return output;
}
