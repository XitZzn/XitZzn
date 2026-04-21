import cron from 'node-cron';
import { listProjects } from '../services/projectService.js';
import { runDailyGeneration } from '../services/generationService.js';

let task;

export function startScheduler() {
  if (task) return;

  task = cron.schedule('0 8 * * *', async () => {
    const projects = listProjects().filter((project) => project.automation_enabled);

    for (const project of projects) {
      try {
        await runDailyGeneration(project);
      } catch (error) {
        console.error(`[Scheduler] Projeto ${project.id} falhou:`, error.message);
      }
    }
  });

  console.log('[Scheduler] Automação diária configurada para 08:00 UTC.');
}
