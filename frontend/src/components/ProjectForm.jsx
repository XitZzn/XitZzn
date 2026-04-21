import { useState } from 'react';

const platforms = ['Blog', 'TikTok', 'YouTube', 'Instagram'];

const initialState = {
  brand_name: '',
  niche: '',
  target_audience: '',
  tone_of_voice: '',
  language: 'Português',
  active_platforms: ['Blog'],
  automation_enabled: true
};

export default function ProjectForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const togglePlatform = (platform) => {
    setForm((current) => {
      const exists = current.active_platforms.includes(platform);
      const active_platforms = exists
        ? current.active_platforms.filter((item) => item !== platform)
        : [...current.active_platforms, platform];
      return { ...current, active_platforms };
    });
  };

  return (
    <form
      className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
        setForm(initialState);
      }}
    >
      {['brand_name', 'niche', 'target_audience', 'tone_of_voice', 'language'].map((field) => (
        <input
          key={field}
          className="rounded-lg bg-zinc-800 p-2"
          placeholder={field}
          value={form[field]}
          onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
          required
        />
      ))}

      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => (
          <button
            type="button"
            key={platform}
            className={`rounded-lg border px-3 py-2 ${form.active_platforms.includes(platform) ? 'border-violet-500 bg-violet-900/40' : 'border-zinc-700'}`}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>

      <button className="rounded-lg bg-violet-600 px-3 py-2 font-medium">Criar Projeto</button>
    </form>
  );
}
