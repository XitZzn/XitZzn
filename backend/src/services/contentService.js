import db from '../db/database.js';

const insertContent = db.prepare(`
  INSERT INTO generated_contents (project_id, platform, topic, payload)
  VALUES (@project_id, @platform, @topic, @payload)
`);

const insertHistory = db.prepare(`
  INSERT INTO generation_history (project_id, status, message)
  VALUES (?, ?, ?)
`);

export function saveGeneratedContent(projectId, platform, topic, payload) {
  insertContent.run({
    project_id: projectId,
    platform,
    topic,
    payload: JSON.stringify(payload)
  });
}

export function addHistory(projectId, status, message) {
  insertHistory.run(projectId, status, message);
}

export function getProjectContents(projectId) {
  return db
    .prepare('SELECT * FROM generated_contents WHERE project_id = ? ORDER BY created_at DESC')
    .all(projectId)
    .map((entry) => ({ ...entry, payload: JSON.parse(entry.payload) }));
}

export function getProjectHistory(projectId) {
  return db
    .prepare('SELECT * FROM generation_history WHERE project_id = ? ORDER BY created_at DESC LIMIT 100')
    .all(projectId);
}
