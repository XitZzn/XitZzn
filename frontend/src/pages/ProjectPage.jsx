import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

const tabs = ['Configurações', 'Conteúdo Gerado', 'Histórico', 'Automação'];

export default function ProjectPage() {
  const { id } = useParams();
  const [tab, setTab] = useState(tabs[0]);
  const [project, setProject] = useState(null);
  const [contents, setContents] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const [projectData, contentData, historyData] = await Promise.all([
        api.getProject(id),
        api.getContent(id),
        api.getHistory(id)
      ]);
      setProject(projectData);
      setContents(contentData);
      setHistory(historyData);
    }

    load();
  }, [id]);

  const grouped = useMemo(() => {
    return contents.reduce((acc, item) => {
      acc[item.platform] = acc[item.platform] || [];
      acc[item.platform].push(item);
      return acc;
    }, {});
  }, [contents]);

  if (!project) return <p>Carregando...</p>;

  return (
    <section className="space-y-4">
      <Link to="/" className="text-violet-300">← Voltar</Link>
      <h1 className="text-2xl font-bold">{project.brand_name}</h1>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            className={`rounded-full px-4 py-2 ${tab === item ? 'bg-violet-600' : 'bg-zinc-800'}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'Configurações' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-2">
          <p>Nicho: {project.niche}</p>
          <p>Público-alvo: {project.target_audience}</p>
          <p>Tom: {project.tone_of_voice}</p>
          <p>Idioma: {project.language}</p>
          <p>Plataformas: {project.active_platforms.join(', ')}</p>
        </div>
      )}

      {tab === 'Conteúdo Gerado' && (
        <div className="space-y-3">
          {Object.entries(grouped).map(([platform, items]) => (
            <div key={platform} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="mb-3 text-xl font-semibold">{platform}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <article key={item.id} className="rounded-lg bg-zinc-800 p-3">
                    <p className="text-violet-300">{item.topic}</p>
                    <p className="line-clamp-4 text-sm text-zinc-300">{item.payload.text}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Histórico' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {history.map((event) => (
            <p key={event.id} className="border-b border-zinc-800 py-2 text-sm">
              [{event.status}] {event.message} - {event.created_at}
            </p>
          ))}
        </div>
      )}

      {tab === 'Automação' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <p>Automação diária via cron às 08:00 UTC.</p>
          <button
            className="rounded-lg bg-emerald-600 px-4 py-2"
            onClick={async () => {
              await api.runAutomation(id);
              const [contentData, historyData] = await Promise.all([api.getContent(id), api.getHistory(id)]);
              setContents(contentData);
              setHistory(historyData);
            }}
          >
            Rodar agora
          </button>
        </div>
      )}
    </section>
  );
}
