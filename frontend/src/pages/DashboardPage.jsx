import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm.jsx';
import { api } from '../services/api.js';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);

  const loadProjects = async () => setProjects(await api.listProjects());

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Projetos Automatizados</h1>
          <p className="text-zinc-400">Marcas sem rosto com geração diária via IA local</p>
        </div>
      </header>

      <ProjectForm
        onSubmit={async (payload) => {
          await api.createProject(payload);
          await loadProjects();
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="text-xl font-semibold">{project.brand_name}</h2>
            <p className="text-zinc-300">Nicho: {project.niche}</p>
            <p className="text-zinc-300">Público: {project.target_audience}</p>
            <p className="text-zinc-300">Tom: {project.tone_of_voice}</p>
            <p className="text-zinc-300">Plataformas: {project.active_platforms.join(', ')}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
