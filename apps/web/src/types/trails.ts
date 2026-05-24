import type { ParkId } from "@/types/parks";

export type TrailDifficulty = "easy" | "medium" | "hard";
export type TrailStatus = "open" | "closed" | "maintenance" | "climate_risk" | "full";

export interface Trail {
  id: string;
  name: string;
  parkId: ParkId;
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

export type NewTrail = Trail;
