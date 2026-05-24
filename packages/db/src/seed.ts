import { createDb } from "./index.js";
import { events, parks, trails, waterfalls } from "./schema/index.js";

const db = createDb();

await db.delete(events);
await db.delete(trails);
await db.delete(waterfalls);
await db.delete(parks);

const [serraDosOrgaos, tresPicos, montanhasDeTeresopolis] = await db
  .insert(parks)
  .values([
    {
      slug: "serra-dos-orgaos",
      name: "Serra dos Órgãos",
      type: "Parque Nacional",
      status: "open",
      description:
        "Criado em 1939, é um dos parques nacionais mais antigos do Brasil. Abriga o famoso Dedo de Deus e a Pedra do Sino, atraindo montanhistas e ecoturistas do mundo inteiro.",
      areaHectares: 20030,
      altitudeMeters: 2275,
      openingHours: "Ter–Dom, 08h às 17h",
      entranceFeeCents: 0,
      biodiversity: ["Mata Atlântica", "Orchidaceae", "Bromeliaceae"],
      highlights: ["Pedra do Sino", "Dedo de Deus", "Cachoeira do Véu da Noiva"],
    },
    {
      slug: "tres-picos",
      name: "Três Picos",
      type: "Parque Estadual",
      status: "open",
      description:
        "O maior parque estadual do Rio de Janeiro, com 56.500 hectares de Mata Atlântica preservada. Protege nascentes importantes e oferece trilhas de alta dificuldade.",
      areaHectares: 65113,
      altitudeMeters: 2366,
      openingHours: "Diário, 07h às 17h",
      entranceFeeCents: 0,
      biodiversity: ["Mata Atlântica", "Palmito-juçara", "Onça-parda"],
      highlights: ["Pico Maior", "Pedra Três Pontões", "Trilha Suspensa"],
    },
    {
      slug: "montanhas-teresopolis",
      name: "Montanhas de Teresópolis",
      type: "Parque Natural Municipal",
      status: "open",
      description:
        "Parque urbano de fácil acesso, ideal para famílias e iniciantes. Possui trilhas curtas, cachoeiras e mirantes com vista panorâmica da cidade.",
      areaHectares: 4397,
      altitudeMeters: 1760,
      openingHours: "Diário, 08h às 18h",
      entranceFeeCents: 1000,
      biodiversity: ["Bromélias", "Sabiá-laranjeira", "Mico-leão-dourado"],
      highlights: ["Mirante do Soberbo", "Trilha das Bromélias", "Cascata do Imbuí"],
    },
  ])
  .returning();
if (!serraDosOrgaos || !tresPicos || !montanhasDeTeresopolis)
  throw new Error("Failed to seed parks");

await db.insert(trails).values([
  {
    name: "Pedra do Sino",
    parkId: serraDosOrgaos.id,
    parkName: "Serra dos Órgãos",
    difficulty: "hard",
    distanceMeters: 11000,
    duration: "5–6h",
    altitudeMeters: 1692,
    status: "climate_risk",
    description:
      "A trilha mais famosa da Serra dos Órgãos. Exige preparo físico e experiência em montanhismo. A vista do cume recompensa cada passo.",
    conditions: "Tempo estável. Levar água (mínimo 2L) e lanche energético.",
    tips: ["Saída às 7h recomendada", "Guia obrigatório até o cume", "Proibido após chuva"],
  },
  {
    name: "Trilha da Suspensa",
    parkId: serraDosOrgaos.id,
    parkName: "Serra dos Órgãos",
    difficulty: "easy",
    distanceMeters: 1300,
    duration: "1h",
    altitudeMeters: 1177,
    status: "open",
    description:
      "Trilha passarela acessível, suspensa sobre a mata, ideal para observar a copa das árvores e a fauna.",
    conditions:
      "Tempo estável. Levar água (mínimo 2L), belas cachoeiras e acessível para cadeirantes.",
    tips: ["Evitar após chuva forte", "Levar repelente"],
  },
  {
    name: "Trilha Prata dos Aredes",
    parkId: tresPicos.id,
    parkName: "Três Picos",
    difficulty: "medium",
    distanceMeters: 1000,
    duration: "1h",
    altitudeMeters: 1350,
    status: "full",
    description: "Trilha interpretativa ideal para famílias. Rica em espécies de aves.",
    conditions:
      "Percurso pelo vale do rio Maria da Prata, com vegetação exuberante e excelente para observação de aves.",
    tips: ["Indicada para crianças", "Guia opcional"],
  },
  {
    name: "Trilha da Tartaruga",
    parkId: montanhasDeTeresopolis.id,
    parkName: "Montanhas de Teresópolis",
    difficulty: "medium",
    distanceMeters: 1250,
    duration: "40m",
    altitudeMeters: 1180,
    status: "maintenance",
    description:
      "caminhada moderada com belas paisagens ao longo do percurso. Temporariamente fechada para manutenção da sinalização.",
    conditions: "Em manutenção. Previsão de reabertura: julho/2026.",
    tips: ["Aguardar reabertura oficial"],
  },
  {
    name: "Trilha da Cascata do Imbuí",
    parkId: montanhasDeTeresopolis.id,
    parkName: "Montanhas de Teresópolis",
    difficulty: "easy",
    distanceMeters: 1400,
    duration: "45min–1h",
    altitudeMeters: 120,
    status: "open",
    description:
      "Trilha curta até a Cascata do Imbuí, com piscina natural para banho. leva a uma queda dágua de aproximadamente 20 metros formada pelo Rio Paquequer.",
    conditions: "Trilha liberada. Piscina acessível. Muito popular nos finais de semana.",
    tips: ["Chegar cedo nos fins de semana", "Levar troca de roupa", "Proibido fogueira"],
  },
  {
    name: "Mirante do Dedo de Deus",
    parkId: serraDosOrgaos.id,
    parkName: "Serra dos Órgãos",
    difficulty: "hard",
    distanceMeters: 9700,
    duration: "3–4h",
    altitudeMeters: 1700,
    status: "closed",
    description:
      "Trilha que leva ao mirante com a melhor vista do Dedo de Deus. Fechada temporariamente para recuperação da vegetação.",
    conditions: "Fechada para recuperação ambiental. Retorno previsto para agosto/2026.",
    tips: ["Consultar reabertura antes de ir"],
  },
]);

await db.insert(events).values([
  {
    title: "Trilha Guiada — Pedra do Sino",
    parkId: serraDosOrgaos.id,
    date: "2026-06-14T04:00:00Z",
    duration: "8h",
    category: "guided_trail",
    status: "open",
    spots: 12,
    spotsLeft: 4,
    description:
      "Trilha guiada até o cume da Pedra do Sino com guia credenciado pelo ICMBio. Inclui briefing de segurança, kit de primeiros socorros e suporte durante todo o percurso.",
    requirements: ["Preparo físico intermediário", "Calçado apropriado", "Água (mínimo 2L)"],
    priceCents: 8000,
  },
  {
    title: "Educação Ambiental — Fauna da Mata Atlântica",
    parkId: tresPicos.id,
    date: "2026-06-21T06:00:00Z",

    duration: "3h",
    category: "education",
    status: "open",
    spots: 30,
    spotsLeft: 18,
    description:
      "Atividade educativa conduzida por biólogos do parque. Aborda a biodiversidade local, espécies ameaçadas e a importância da conservação da Mata Atlântica.",
    requirements: ["Qualquer idade", "Roupa confortável"],
    priceCents: 0,
  },
  {
    title: "Mutirão de Limpeza — Circuito Verde",
    parkId: montanhasDeTeresopolis.id,
    date: "2026-07-05T05:00:00Z",
    duration: "4h",
    category: "volunteer",
    status: "open",
    spots: 50,
    spotsLeft: 23,
    description:
      "Ação voluntária de coleta de resíduos nas trilhas e entorno do parque. Material de coleta fornecido pela organização. Certificado de participação ao final.",
    requirements: ["Luvas de proteção", "Calçado fechado"],
    priceCents: 0,
  },
  {
    title: "Observação Noturna de Fauna",
    parkId: serraDosOrgaos.id,
    date: "2026-07-12T16:00:00Z",
    duration: "3h",
    category: "education",
    status: "few_spots",
    spots: 15,
    spotsLeft: 2,
    description:
      "Atividade noturna para observação de animais de hábitos noturnos nativos da Serra dos Órgãos. Conduzida por zoólogo especialista com equipamento de visão noturna.",
    requirements: ["Maiores de 14 anos", "Lanterna", "Roupa escura e quente"],
    priceCents: 6000,
  },
  {
    title: "Workshop de Fotografia na Natureza",
    parkId: tresPicos.id,
    date: "2026-07-19T03:30:00Z",
    duration: "5h",
    category: "workshop",
    status: "open",
    spots: 10,
    spotsLeft: 7,
    description:
      "Workshop prático de fotografia de natureza e paisagem. Saída ao amanhecer para capturar a neblina da serra. Instrutor com experiência em fotografia de natureza.",
    requirements: ["Câmera fotográfica (qualquer)", "Disposição para caminhada leve"],
    priceCents: 12000,
  },
]);

await db.insert(waterfalls).values([
  {
    name: "Cascata do Imbuí",
    parkId: montanhasDeTeresopolis.id,
    parkName: "Montanhas de Teresópolis",
    heightMeters: 18,
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
    name: "Cachoeira dos Frades",
    parkId: tresPicos.id,
    parkName: "Três Picos",
    heightMeters: 800,
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
]);

console.log("Database seeded successfully.");
process.exit(0);
