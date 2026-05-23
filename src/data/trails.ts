export type TrailDifficulty = "easy" | "medium" | "hard";
export type TrailStatus = "open" | "closed" | "maintenance" | "climate_risk" | "full";

export interface Trail {
  id: string;
  name: string;
  parkId: string;
  parkName: string;
  difficulty: TrailDifficulty;
  distance: number;
  duration: string;
  altitude: number;
  status: TrailStatus;
  description: string;
  conditions: string;
  tips: string[];
}

/**
 * Mock data das trilhas.
 * status possíveis: 'open' | 'closed' | 'maintenance' | 'climate_risk' | 'full'
 */
export const trails: Trail[] = [
  {
    id: "pedra-do-sino",
    name: "Pedra do Sino",
    parkId: "serra-dos-orgaos",
    parkName: "Serra dos Órgãos",
    difficulty: "hard",
    distance: 11,
    duration: "5–6h",
    altitude: 1692,
    status: "climate_risk",
    description:
      "A trilha mais famosa da Serra dos Órgãos. Exige preparo físico e experiência em montanhismo. A vista do cume recompensa cada passo.",
    conditions: "Tempo estável. Levar água (mínimo 2L) e lanche energético.",
    tips: ["Saída às 7h recomendada", "Guia obrigatório até o cume", "Proibido após chuva"],
  },
  {
    id: "suspensa",
    name: "Trilha da Suspensa",
    parkId: "serra-dos-orgaos",
    parkName: "Serra dos Órgãos",
    difficulty: "easy",
    distance: 1.3,
    duration: "1h",
    altitude: 1177,
    status: "open",
    description:
      "Trilha passarela acessível, suspensa sobre a mata, ideal para observar a copa das árvores e a fauna.",
    conditions:
      "Tempo estável. Levar água (mínimo 2L), belas cachoeiras e acessível para cadeirantes.",
    tips: ["Evitar após chuva forte", "Levar repelente"],
  },
  {
    id: "prata-dos-aredes",
    name: "Trilha Prata dos Aredes",
    parkId: "tres-picos",
    parkName: "Três Picos",
    difficulty: "medium",
    distance: 1,
    duration: "1h",
    altitude: 1350,
    status: "full",
    description: "Trilha interpretativa ideal para famílias. Rica em espécies de aves.",
    conditions:
      "Percurso pelo vale do rio Maria da Prata, com vegetação exuberante e excelente para observação de aves.",
    tips: ["Indicada para crianças", "Guia opcional"],
  },
  {
    id: "trilha-da-tartaruga",
    name: "Trilha da Tartaruga",
    parkId: "montanhas-teresopolis",
    parkName: "Montanhas de Teresópolis",
    difficulty: "medium",
    distance: 1.25,
    duration: "40m",
    altitude: 1180,
    status: "maintenance",
    description:
      "caminhada moderada com belas paisagens ao longo do percurso. Temporariamente fechada para manutenção da sinalização.",
    conditions: "Em manutenção. Previsão de reabertura: julho/2026.",
    tips: ["Aguardar reabertura oficial"],
  },
  {
    id: "cachoeira-imbuí",
    name: "Trilha da Cascata do Imbuí",
    parkId: "montanhas-teresopolis",
    parkName: "Montanhas de Teresópolis",
    difficulty: "easy",
    distance: 1.4,
    duration: "45min–1h",
    altitude: 120,
    status: "open",
    description:
      "Trilha curta até a Cascata do Imbuí, com piscina natural para banho. leva a uma queda dágua de aproximadamente 20 metros formada pelo Rio Paquequer.",
    conditions: "Trilha liberada. Piscina acessível. Muito popular nos finais de semana.",
    tips: ["Chegar cedo nos fins de semana", "Levar troca de roupa", "Proibido fogueira"],
  },
  {
    id: "dedo-de-deus",
    name: "Mirante do Dedo de Deus",
    parkId: "serra-dos-orgaos",
    parkName: "Serra dos Órgãos",
    difficulty: "hard",
    distance: 9.7,
    duration: "3–4h",
    altitude: 1700,
    status: "closed",
    description:
      "Trilha que leva ao mirante com a melhor vista do Dedo de Deus. Fechada temporariamente para recuperação da vegetação.",
    conditions: "Fechada para recuperação ambiental. Retorno previsto para agosto/2026.",
    tips: ["Consultar reabertura antes de ir"],
  },
];
