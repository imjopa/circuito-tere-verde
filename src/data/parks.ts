export type ParkId = "serra-dos-orgaos" | "tres-picos" | "montanhas-teresopolis";

export interface Park {
  id: ParkId;
  name: string;
  type: string;
  status: string;
  description: string;
  area: string;
  altitude: string;
  openingHours: string;
  entranceFee: string;
  biodiversity: string[];
  highlights: string[];
}

export const parks: Park[] = [
  {
    id: "serra-dos-orgaos",
    name: "Serra dos Órgãos",
    type: "Parque Nacional",
    status: "open",
    description:
      "Criado em 1939, é um dos parques nacionais mais antigos do Brasil. Abriga o famoso Dedo de Deus e a Pedra do Sino, atraindo montanhistas e ecoturistas do mundo inteiro.",
    area: "20.030 ha",
    altitude: "2.275 m",
    openingHours: "Ter–Dom, 08h às 17h",
    entranceFee: "Gratuito",
    biodiversity: ["Mata Atlântica", "Orchidaceae", "Bromeliaceae"],
    highlights: ["Pedra do Sino", "Dedo de Deus", "Cachoeira do Véu da Noiva"],
  },
  {
    id: "tres-picos",
    name: "Três Picos",
    type: "Parque Estadual",
    status: "open",
    description:
      "O maior parque estadual do Rio de Janeiro, com 56.500 hectares de Mata Atlântica preservada. Protege nascentes importantes e oferece trilhas de alta dificuldade.",
    area: "65.113 ha",
    altitude: "2366 m",
    openingHours: "Diário, 07h às 17h",
    entranceFee: "Gratuito",
    biodiversity: ["Mata Atlântica", "Palmito-juçara", "Onça-parda"],
    highlights: ["Pico Maior", "Pedra Três Pontões", "Trilha Suspensa"],
  },
  {
    id: "montanhas-teresopolis",
    name: "Montanhas de Teresópolis",
    type: "Parque Natural Municipal",
    status: "open",
    description:
      "Parque urbano de fácil acesso, ideal para famílias e iniciantes. Possui trilhas curtas, cachoeiras e mirantes com vista panorâmica da cidade.",
    area: "4.397 ha",
    altitude: "1.760 m",
    openingHours: "Diário, 08h às 18h",
    entranceFee: "R$ 10,00",
    biodiversity: ["Bromélias", "Sabiá-laranjeira", "Mico-leão-dourado"],
    highlights: ["Mirante do Soberbo", "Trilha das Bromélias", "Cascata do Imbuí"],
  },
];
