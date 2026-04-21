import { generateTextWithOllama, generateAudioWithCoqui, generateImageWithStableDiffusion, renderVideoWithFFmpeg } from './aiProviders.js';
import { saveGeneratedContent, addHistory } from './contentService.js';

const PLATFORM_PROMPTS = {
  Blog: (topic, project) => `Você é especialista em SEO. Crie artigo completo sobre ${topic} para a marca ${project.brand_name} no nicho ${project.niche}. Idioma: ${project.language}. Público: ${project.target_audience}. Tom: ${project.tone_of_voice}.`,
  TikTok: (topic, project) => `Crie um roteiro curto e viral de TikTok com gancho inicial e CTA sobre ${topic}. Idioma ${project.language}.`,
  YouTube: (topic, project) => `Crie roteiro longo para YouTube com abertura, desenvolvimento por blocos e fechamento sobre ${topic}. Idioma ${project.language}.`,
  Instagram: (topic, project) => `Crie legenda + ideia de post para Instagram sobre ${topic}. Idioma ${project.language}.`
};

export async function generateDailyTopics(project) {
  const prompt = `Gere 3 temas atuais para o nicho ${project.niche} focando em ${project.target_audience}. Responda em JSON array.`;
  const raw = await generateTextWithOllama(prompt);
  try {
    const jsonStart = raw.indexOf('[');
    const jsonEnd = raw.lastIndexOf(']');
    return JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  } catch {
    return [raw.slice(0, 120)];
  }
}

export async function runDailyGeneration(project) {
  addHistory(project.id, 'running', 'Iniciando geração diária');

  try {
    const topics = await generateDailyTopics(project);

    for (const platform of project.active_platforms) {
      for (const topic of topics) {
        const promptBuilder = PLATFORM_PROMPTS[platform];
        if (!promptBuilder) continue;

        const text = await generateTextWithOllama(promptBuilder(topic, project));
        const payload = { text };

        if (platform === 'TikTok' || platform === 'YouTube' || platform === 'Instagram') {
          const audioPath = await generateAudioWithCoqui(text, project.id, platform.toLowerCase());
          const imagePath = await generateImageWithStableDiffusion(`${topic}, cinematic background`, project.id, platform.toLowerCase());
          const videoPath = await renderVideoWithFFmpeg({
            audioPath,
            imagePath,
            text: topic,
            projectId: project.id,
            platform: platform.toLowerCase()
          });
          payload.audioPath = audioPath;
          payload.imagePath = imagePath;
          payload.videoPath = videoPath;
        }

        saveGeneratedContent(project.id, platform, topic, payload);
      }
    }

    addHistory(project.id, 'success', 'Geração diária finalizada com sucesso');
  } catch (error) {
    addHistory(project.id, 'error', error.message);
    throw error;
  }
}
