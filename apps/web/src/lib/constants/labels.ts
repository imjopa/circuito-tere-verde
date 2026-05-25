import type {
  ParkEventCategory,
  ParkEventStatus,
  ParkStatus,
  TrailDifficulty,
  WaterfallAccess,
} from "@circuito/db/client";

export const parkStatusLabels: Record<ParkStatus, string> = {
  open: "Aberto",
  closed: "Fechado",
  maintenance: "Manutenção",
};

export const categoryLabels: Record<ParkEventCategory, string> = {
  guided_trail: "Trilha guiada",
  education: "Educativo",
  volunteer: "Voluntário",
  workshop: "Workshop",
};

export const statusLabels: Record<ParkEventStatus, string> = {
  open: "Vagas disponíveis",
  few_spots: "Últimas vagas",
  full: "Esgotado",
  cancelled: "Cancelado",
};

export const waterfallAccessFilterLabels: Record<WaterfallAccess, string> = {
  easy: "Fácil",
  medium: "Moderado",
  hard: "Difícil",
};

export const waterfallAccessLabels: Record<WaterfallAccess, string> = {
  easy: "Fácil acesso",
  medium: "Acesso moderado",
  hard: "Acesso difícil",
};

export const difficultyLabels: Record<TrailDifficulty, string> = {
  easy: "Fácil",
  medium: "Moderado",
  hard: "Difícil",
} as const;
