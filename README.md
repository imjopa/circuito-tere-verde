# 🌿 Circuito Terê Verde
> Plataforma digital unificada de turismo consciente para os parques naturais de Teresópolis, RJ.

---

## 👥 Integrantes

| Nome | RA |
|------|----|
| João Paulo da Costa Rosa | 06007776 |
| Leonardo Gurgel | XXXXXXXX |

---

## 📌 Situação-Problema

Teresópolis concentra três importantes unidades de conservação — o **Parque Nacional da Serra dos Órgãos**, o **Parque Estadual dos Três Picos** e o **Parque Natural Municipal Montanhas de Teresópolis** — mas não existe uma plataforma digital unificada que centralize informações turísticas, ambientais e operacionais desses parques de forma moderna, acessível e atualizada.

O resultado: turistas desinformados, experiências ruins, danos ambientais por desconhecimento e administradores sem ferramentas de gestão digital.

---

## 🎯 Descrição do MVP

O **Circuito Terê Verde** é um website moderno e responsivo que:

- **Centraliza informações** dos 3 parques em uma única plataforma
- **Exibe trilhas** com dados técnicos (distância, duração, altitude, dificuldade) e status em tempo real
- **Lista eventos** ambientais e atividades educativas
- **Fornece área administrativa** segura para gestão de conteúdo e monitoramento

### Telas do MVP

| Tela | Descrição |
|------|-----------|
| **Home** | Landing page com hero, busca, cards dos 3 parques, acesso rápido e eventos |
| **Admin — Login** | Autenticação segura com proteção de rotas |
| **Admin — Dashboard** | Métricas de acesso, gestão de trilhas e gráfico de visitantes |

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + Vite 5 |
| Roteamento | React Router v6 |
| Estilização | CSS Modules |
| Estado | useState + hooks customizados |
| Dados | Mock JSON local |
| Deploy | Vercel |

---

## 🚀 Como executar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/circuito-tere-verde.git

# 2. Acesse a pasta
cd circuito-tere-verde

# 3. Instale as dependências
npm install

# 4. Rode o servidor de desenvolvimento
npm run dev

# 5. Acesse no navegador
# http://localhost:5173
```

### Credenciais de demonstração (área admin)

```
E-mail: admin@tereverde.com.br
Senha:  123456
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin/        # ProtectedRoute
│   ├── layout/       # Navbar
│   ├── parks/        # ParkCard
│   ├── trails/       # TrailCard
│   └── ui/           # StatusBadge, DifficultyBadge
├── data/
│   ├── events.js      # Mock data dos eventos
│   ├── parks.js      # Mock data dos parques
│   └── trails.js     # Mock data das trilhas
│   └── waterfalls.js     # Mock data das cachoeiras
├── hooks/
│   ├── useAdminMetrics.js  # Métricas de Administrador simulada
│   ├── useAuth.js          # Autenticação simulada
│   └── useDashboardMetrics.js  # Métricas de Dashboard simulada
│   └── useHomeSearch.js  # Métricas de Busca simulada
│   └── useTrailFilters.js  # Filtros reativos
├── pages/
│   ├── Configuração e Estilização das Páginas
│   ├── ...
└── styles/
    └── global.css    # Variáveis CSS e reset
```

---

## 📋 Requisitos Funcionais

- [x] RF01 — Exibir informações dos 3 parques (descrição, horários, fauna, flora)
- [x] RF02 — Listar trilhas com dados técnicos e status
- [x] RF03 — Filtrar trilhas por dificuldade e parque
- [x] RF04 — Busca textual por nome de trilha ou parque
- [x] RF05 — Exibir próximos eventos ambientais
- [x] RF06 — Autenticação de administrador
- [x] RF07 — Proteção de rotas administrativas
- [x] RF08 — Dashboard com métricas e gestão de trilhas

## 📋 Requisitos Não-Funcionais

- [x] RNF01 — Interface responsiva (mobile-first)
- [x] RNF02 — Carregamento rápido (Vite + CSS Modules)
- [x] RNF03 — Acessibilidade (labels, roles, contraste)
- [x] RNF04 — Código organizado em componentes reutilizáveis
- [x] RNF05 — Separação de responsabilidades (hooks, data, components, pages)
- [x] RNF06 — Rotas protegidas com sessionStorage

---
