import db from '../db/database.js';

const insertProject = db.prepare(`
  INSERT INTO projects (brand_name, niche, target_audience, tone_of_voice, language, active_platforms, automation_enabled)
  VALUES (@brand_name, @niche, @target_audience, @tone_of_voice, @language, @active_platforms, @automation_enabled)
`);

const updateProjectStmt = db.prepare(`
  UPDATE projects
  SET brand_name=@brand_name,
      niche=@niche,
      target_audience=@target_audience,
      tone_of_voice=@tone_of_voice,
      language=@language,
      active_platforms=@active_platforms,
      automation_enabled=@automation_enabled,
      updated_at=CURRENT_TIMESTAMP
  WHERE id=@id
`);

export function listProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map(parseProject);
}

export function getProjectById(id) {
  const item = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return item ? parseProject(item) : null;
}

export function createProject(data) {
  const result = insertProject.run({
    ...data,
    active_platforms: JSON.stringify(data.active_platforms),
    automation_enabled: data.automation_enabled ? 1 : 0
  });
  return getProjectById(result.lastInsertRowid);
}

export function updateProject(id, data) {
  updateProjectStmt.run({
    id,
    ...data,
    active_platforms: JSON.stringify(data.active_platforms),
    automation_enabled: data.automation_enabled ? 1 : 0
  });
  return getProjectById(id);
}

function parseProject(item) {
  return {
    ...item,
    active_platforms: JSON.parse(item.active_platforms),
    automation_enabled: Boolean(item.automation_enabled)
  };
}
