import { createDb, type Park, type ParkEvent, type Trail } from "./index.js";
import { events, parks, trails } from "./schema.js";

const seedParks = [
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
] satisfies Park[];

const seedTrails = [
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
] satisfies Trail[];

const seedEvents = [
  {
    id: "ev-001",
    title: "Trilha Guiada — Pedra do Sino",
    park: "Serra dos Órgãos",
    parkId: "serra-dos-orgaos",
    date: "2026-06-14",
    time: "07:00",
    duration: "8h",
    category: "guided_trail",
    categoryLabel: "Trilha Guiada",
    status: "open",
    spots: 12,
    spotsLeft: 4,
    description:
      "Trilha guiada até o cume da Pedra do Sino com guia credenciado pelo ICMBio. Inclui briefing de segurança, kit de primeiros socorros e suporte durante todo o percurso.",
    requirements: ["Preparo físico intermediário", "Calçado apropriado", "Água (mínimo 2L)"],
    price: "R$ 80,00 por pessoa",
  },
  {
    id: "ev-002",
    title: "Educação Ambiental — Fauna da Mata Atlântica",
    park: "Três Picos",
    parkId: "tres-picos",
    date: "2026-06-21",
    time: "09:00",
    duration: "3h",
    category: "education",
    categoryLabel: "Educativo",
    status: "open",
    spots: 30,
    spotsLeft: 18,
    description:
      "Atividade educativa conduzida por biólogos do parque. Aborda a biodiversidade local, espécies ameaçadas e a importância da conservação da Mata Atlântica.",
    requirements: ["Qualquer idade", "Roupa confortável"],
    price: "Gratuito",
  },
  {
    id: "ev-003",
    title: "Mutirão de Limpeza — Circuito Verde",
    park: "Montanhas de Teresópolis",
    parkId: "montanhas-teresopolis",
    date: "2026-07-05",
    time: "08:00",
    duration: "4h",
    category: "volunteer",
    categoryLabel: "Voluntário",
    status: "open",
    spots: 50,
    spotsLeft: 23,
    description:
      "Ação voluntária de coleta de resíduos nas trilhas e entorno do parque. Material de coleta fornecido pela organização. Certificado de participação ao final.",
    requirements: ["Luvas de proteção", "Calçado fechado"],
    price: "Gratuito",
  },
  {
    id: "ev-004",
    title: "Observação Noturna de Fauna",
    park: "Serra dos Órgãos",
    parkId: "serra-dos-orgaos",
    date: "2026-07-12",
    time: "19:00",
    duration: "3h",
    category: "education",
    categoryLabel: "Educativo",
    status: "few_spots",
    spots: 15,
    spotsLeft: 2,
    description:
      "Atividade noturna para observação de animais de hábitos noturnos nativos da Serra dos Órgãos. Conduzida por zoólogo especialista com equipamento de visão noturna.",
    requirements: ["Maiores de 14 anos", "Lanterna", "Roupa escura e quente"],
    price: "R$ 60,00 por pessoa",
  },
  {
    id: "ev-005",
    title: "Workshop de Fotografia na Natureza",
    park: "Três Picos",
    parkId: "tres-picos",
    date: "2026-07-19",
    time: "06:30",
    duration: "5h",
    category: "workshop",
    categoryLabel: "Workshop",
    status: "open",
    spots: 10,
    spotsLeft: 7,
    description:
      "Workshop prático de fotografia de natureza e paisagem. Saída ao amanhecer para capturar a neblina da serra. Instrutor com experiência em fotografia de natureza.",
    requirements: ["Câmera fotográfica (qualquer)", "Disposição para caminhada leve"],
    price: "R$ 120,00 por pessoa",
  },
] satisfies ParkEvent[];

const db = createDb();

async function seed() {
  await db.delete(events);
  await db.delete(trails);
  await db.delete(parks);

  await db.insert(parks).values(seedParks);
  await db.insert(trails).values(seedTrails);
  await db.insert(events).values(seedEvents);

  console.log("Database seeded successfully.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
