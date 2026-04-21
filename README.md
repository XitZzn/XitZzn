# Faceless AI Content Engine (100% local e gratuito)

Dashboard DARK para criar e gerenciar projetos de conteúdo automatizado com IA local.

## Stack

- **Frontend:** React + Tailwind (Vite)
- **Backend:** Node.js + Express
- **Banco:** SQLite (local)
- **IA de texto:** Ollama (ex. `llama3.1`)
- **IA de voz:** Coqui TTS (`tts` CLI)
- **IA de imagem:** Stable Diffusion local (Diffusers)
- **Vídeo:** FFmpeg
- **Automação:** node-cron

## Estrutura de pastas

```bash
.
├── backend
│   ├── data/                     # SQLite + artefatos gerados
│   ├── scripts/
│   │   └── sd_generate.py        # geração de imagem local
│   └── src
│       ├── automation/scheduler.js
│       ├── db/database.js
│       ├── routes/projectRoutes.js
│       ├── services/
│       │   ├── aiProviders.js
│       │   ├── contentService.js
│       │   ├── generationService.js
│       │   └── projectService.js
│       ├── utils/command.js
│       └── server.js
├── frontend
│   ├── src/components/ProjectForm.jsx
│   ├── src/pages/DashboardPage.jsx
│   ├── src/pages/ProjectPage.jsx
│   └── src/services/api.js
└── README.md
```

## Pré-requisitos locais

1. Node.js 20+
2. Python 3.10+
3. `ffmpeg` instalado no PATH
4. `ollama` instalado e com modelo local:
   ```bash
   ollama pull llama3.1
   ```
5. Coqui TTS CLI:
   ```bash
   pip install TTS
   ```
6. Stable Diffusion (Diffusers + torch):
   ```bash
   pip install diffusers transformers accelerate torch
   ```

## Como rodar

```bash
npm install
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Fluxo de automação diária

- O scheduler roda diariamente às **08:00 UTC**.
- Para cada projeto com automação ativa:
  1. Gera temas relevantes por nicho
  2. Gera conteúdo por plataforma ativa
  3. Para vídeo (TikTok/YouTube/Instagram):
     - narração com Coqui TTS
     - imagem com Stable Diffusion
     - montagem com FFmpeg
  4. Persiste tudo no SQLite

## Abas do projeto

- **Configurações:** metadados da marca
- **Conteúdo Gerado:** material por plataforma
- **Histórico:** log de execução
- **Automação:** execução manual “Rodar agora” + rotina cron

## Exemplos de chamadas internas (REST)

### Criar projeto

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "ZenMode",
    "niche": "Mindfulness",
    "target_audience": "Adultos com rotina estressante",
    "tone_of_voice": "Calmo e motivador",
    "language": "Português",
    "active_platforms": ["Blog", "TikTok", "YouTube", "Instagram"],
    "automation_enabled": true
  }'
```

### Rodar geração manual

```bash
curl -X POST http://localhost:4000/api/projects/1/run
```

### Listar conteúdo gerado

```bash
curl http://localhost:4000/api/projects/1/content
```

## Extensão futura

- Adicionar novos “adapters” de plataforma em `generationService.js`
- Trocar SQLite por Supabase Free (mantendo camada de serviços)
- Adicionar filas (ex. BullMQ + Redis local) para alto volume

