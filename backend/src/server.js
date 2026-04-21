import express from 'express';
import cors from 'cors';
import { migrate } from './db/database.js';
import projectRoutes from './routes/projectRoutes.js';
import { startScheduler } from './automation/scheduler.js';

const app = express();
const PORT = process.env.PORT || 4000;

migrate();
startScheduler();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
