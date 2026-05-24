import type { ParkId } from "./parks";

export type AccessDifficulty = "easy" | "medium" | "hard";

export interface Waterfall {
  id: string;
  name: string;
  parkId: ParkId;
  parkName: string;
  height: string;
  access: AccessDifficulty;
  allowsBathing: boolean;
  description: string;
  tips: string[];
  accessibility: string;
  howToGet: string;
}

export const waterfalls: Waterfall[] = [
  {
    id: "cascata-imbuí",
    name: "Cascata do Imbuí",
    parkId: "montanhas-teresopolis",
    parkName: "Montanhas de Teresópolis",
    height: "18m",
    access: "easy",
    allowsBathing: true,
    description:
      "A mais visitada de Teresópolis. Piscina natural cristalina formada pela cascata, ideal para banho. Acesso por trilha curta de 1,4 km a partir do portão principal do parque.",
    howToGet: "Portão principal do Parque Natural Municipal. Estacionamento disponível.",
    tips: [
      "Chegar cedo nos fins de semana",
      "Levar troca de roupa",
      "Proibido fogueira e churrasco",
    ],
    accessibility: "Parcialmente acessível (primeiros 500m)",
  },
  {
    id: "frades",
    name: "Cachoeira dos Frades",
    parkId: "tres-picos",
    parkName: "Três Picos",
    height: "800m",
    access: "easy",
    allowsBathing: false,
    description:
      "Um dos cartões postais de Teresópolis, possui uma linda queda de aproximadamente 10 metros de altura, com declive acentuado e um grande volume dágua que forma uma grande piscina natural. A cachoeira ainda conta com uma mini praia e um gramado para quem quiser pegar um pouco de sol na serra ou brincar com a criançada.",
    howToGet:
      "No KM 20 da Rodovia Teresópolis-Friburgo (RJ – 130). Para quem está seguindo de Teresópolis para Friburgo, a estradinha que dá acesso à cachoeira fica do lado direito da rodovia.",
    tips: [
      "Levar câmera fotográfica",
      "Melhor horário: manhã (luz natural)",
      "Respeitar a faixa de segurança",
    ],
    accessibility: "Não acessível para cadeirantes",
  },
];
