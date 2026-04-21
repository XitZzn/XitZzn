import { Router } from 'express';
import { z } from 'zod';
import { createProject, getProjectById, listProjects, updateProject } from '../services/projectService.js';
import { getProjectContents, getProjectHistory } from '../services/contentService.js';
import { runDailyGeneration } from '../services/generationService.js';

const router = Router();

const projectSchema = z.object({
  brand_name: z.string().min(2),
  niche: z.string().min(2),
  target_audience: z.string().min(2),
  tone_of_voice: z.string().min(2),
  language: z.string().min(2),
  active_platforms: z.array(z.enum(['Blog', 'TikTok', 'YouTube', 'Instagram'])).min(1),
  automation_enabled: z.boolean().default(true)
});

router.get('/', (_, res) => {
  res.json(listProjects());
});

router.post('/', (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const project = createProject(parsed.data);
  return res.status(201).json(project);
});

router.get('/:id', (req, res) => {
  const project = getProjectById(Number(req.params.id));
  if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });
  return res.json(project);
});

router.put('/:id', (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const project = updateProject(Number(req.params.id), parsed.data);
  return res.json(project);
});

router.get('/:id/content', (req, res) => {
  res.json(getProjectContents(Number(req.params.id)));
});

router.get('/:id/history', (req, res) => {
  res.json(getProjectHistory(Number(req.params.id)));
});

router.post('/:id/run', async (req, res) => {
  const project = getProjectById(Number(req.params.id));
  if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });

  try {
    await runDailyGeneration(project);
    return res.json({ message: 'Automação executada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
