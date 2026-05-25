# 🌿 Circuito Terê Verde

> Plataforma digital unificada de turismo consciente para os parques naturais de Teresópolis, RJ.

---

## 👥 Integrantes

| Nome                            | Matrícula |
| ------------------------------- | --------- |
| João Paulo da Costa Rosa        | 06007776  |
| Leonardo Gurgel Maciel Ferreira | 06010973  |

---

## 📌 Situação-Problema

Teresópolis concentra três importantes unidades de conservação — o **Parque Nacional da Serra dos Órgãos**, o **Parque Estadual dos Três Picos** e o **Parque Natural Municipal Montanhas de Teresópolis** — mas não existe uma plataforma digital unificada que centralize informações turísticas, ambientais e operacionais desses parques de forma moderna, acessível e atualizada.

O resultado: turistas desinformados, experiências ruins, danos ambientais por desconhecimento e administradores sem ferramentas de gestão digital.

---

## 🎯 Descrição do MVP

O **Circuito Terê Verde** é um website moderno e responsivo que:

- **Centraliza informações** dos 3 parques em uma única plataforma
- **Exibe trilhas** com dados técnicos (distância, duração, altitude, dificuldade) e status em tempo real
- **Lista cachoeiras** com filtros por parque e nível de acesso
- **Lista eventos** ambientais e atividades educativas
- **Oferece busca global** por trilhas, parques e cachoeiras
- **Fornece área administrativa** segura para gestão de trilhas e eventos

### Telas

| Área    | Rota               | Descrição                                                 |
| ------- | ------------------ | --------------------------------------------------------- |
| Pública | `/`                | Landing page com hero, busca, cards dos parques e eventos |
| Pública | `/trilhas`         | Listagem de trilhas com filtros por dificuldade e parque  |
| Pública | `/cachoeiras`      | Listagem de cachoeiras com filtros por parque e acesso    |
| Pública | `/eventos`         | Calendário de eventos ambientais e educativos             |
| Pública | `/horarios`        | Horários de funcionamento e agendamento                   |
| Pública | `/mapas`           | Mapas e informações de localização dos parques            |
| Pública | `/contato`         | Formulário de contato                                     |
| Pública | `/sobre`           | Sobre o projeto                                           |
| Admin   | `/admin`           | Login com proteção de rotas                               |
| Admin   | `/admin/dashboard` | Métricas de acesso e visão geral                          |
| Admin   | `/admin/trilhas`   | Gestão de status e informações das trilhas                |
| Admin   | `/admin/eventos`   | Gestão de eventos (criar, editar, excluir)                |

---

## 🛠️ Tecnologias

| Camada      | Tecnologia                             |
| ----------- | -------------------------------------- |
| Monorepo    | pnpm workspaces + Turborepo            |
| Frontend    | React 19 + Vite 8 + TypeScript         |
| Estilização | Tailwind CSS 4 + tailwind-variants     |
| Roteamento  | React Router v7                        |
| Estado/API  | TanStack Query + nuqs (filtros na URL) |
| Backend     | Hono (Node.js)                         |
| Banco       | PostgreSQL 16 + Drizzle ORM            |
| Qualidade   | oxlint + oxfmt                         |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 26+ (ver `.tool-versions`)
- [pnpm](https://pnpm.io/) 11+
- [Docker](https://www.docker.com/) (para o PostgreSQL)

---

## 🚀 Como executar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/circuito-tere-verde.git
cd circuito-tere-verde

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Suba o banco de dados
docker compose up -d

# 5. Execute as migrações e o seed
pnpm db:migrate
pnpm db:seed

# 6. Inicie frontend e API em modo desenvolvimento
pnpm dev
```

Acesse o site em http://localhost:5173/

### Credenciais de demonstração (área admin)

```
E-mail: admin@tereverde.com.br
Senha:  123456
```

## 📜 Scripts disponíveis

| Comando            | Descrição                                 |
| ------------------ | ----------------------------------------- |
| `pnpm dev`         | Sobe web + API em modo desenvolvimento    |
| `pnpm build`       | Build de produção de todos os pacotes     |
| `pnpm check`       | Lint, formatação e checagem de tipos      |
| `pnpm db:migrate`  | Aplica migrações no banco                 |
| `pnpm db:seed`     | Popula o banco com dados iniciais         |
| `pnpm db:generate` | Gera migrações a partir do schema Drizzle |

---

## 📁 Estrutura do Projeto

```
circuito-tere-verde/
├── apps/
│   ├── api/                    # API REST (Hono)
│   │   └── src/
│   │       ├── index.ts
│   │       └── routes/         # parks, trails, events, waterfalls, search
│   └── web/                    # Frontend (React + Vite)
│       └── src/
│           ├── components/
│           │   ├── admin/      # AdminLayout, ProtectedRoute
│           │   ├── layout/     # Navbar
│           │   ├── parks/      # ParkCard
│           │   ├── trails/     # TrailCard
│           │   └── ui/         # Button, badges, filtros, busca...
│           ├── hooks/
│           │   ├── data/       # useParks, useTrails, useEvents, useWaterfalls, useSearch
│           │   ├── useAuth.ts
│           │   └── useAdminMetrics.ts
│           ├── pages/          # Telas públicas e admin
│           └── lib/              # query-client
├── packages/
│   └── db/                     # Schema Drizzle, migrações e seed
│       ├── src/schema/         # park, trail, event, waterfall
│       └── drizzle/            # Migrações SQL
├── docker-compose.yml          # PostgreSQL 16
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 🔌 API

| Método   | Rota          | Descrição                                          |
| -------- | ------------- | -------------------------------------------------- |
| `GET`    | `/health`     | Status da API                                      |
| `GET`    | `/parks`      | Lista parques                                      |
| `GET`    | `/trails`     | Lista trilhas (filtros: `q`, `park`, `difficulty`) |
| `PATCH`  | `/trails/:id` | Atualiza trilha                                    |
| `DELETE` | `/trails/:id` | Remove trilha                                      |
| `GET`    | `/events`     | Lista eventos (filtros: `park`, `category`)        |
| `PATCH`  | `/events/:id` | Atualiza evento                                    |
| `DELETE` | `/events/:id` | Remove evento                                      |
| `GET`    | `/waterfalls` | Lista cachoeiras (filtros: `park`, `access`)       |
| `GET`    | `/search`     | Busca global (`q`)                                 |

## 📋 Requisitos Funcionais

- [x] RF01 — Exibir informações dos 3 parques (descrição, horários, biodiversidade)
- [x] RF02 — Listar trilhas com dados técnicos e status
- [x] RF03 — Filtrar trilhas por dificuldade e parque
- [x] RF04 — Busca textual por trilhas, parques e cachoeiras
- [x] RF05 — Exibir eventos ambientais com filtros
- [x] RF06 — Listar cachoeiras com filtros por parque e acesso
- [x] RF07 — Autenticação de administrador
- [x] RF08 — Proteção de rotas administrativas
- [x] RF09 — Dashboard com métricas e gestão de trilhas e eventos

## 📋 Requisitos Não-Funcionais

- [x] RNF01 — Interface responsiva
- [x] RNF02 — Carregamento rápido (Vite + React Compiler)
- [x] RNF03 — Acessibilidade (labels, roles, contraste)
- [x] RNF04 — Código organizado em componentes reutilizáveis
- [x] RNF05 — Separação de responsabilidades (monorepo: web, api, db)
- [x] RNF06 — Rotas protegidas com sessionStorage
- [x] RNF07 — Dados persistidos em PostgreSQL com API REST
