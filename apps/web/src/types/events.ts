import type { ParkId } from "@/types/parks";

export type ParkEventCategory = "guided_trail" | "education" | "volunteer" | "workshop";
export type ParkEventStatus = "open" | "few_spots" | "full" | "cancelled";

export interface ParkEvent {
  id: string;
  title: string;
  park: string;
  parkId: ParkId;
  date: string;
  time: string;
  duration: string;
  category: ParkEventCategory;
  categoryLabel: string;
  status: ParkEventStatus;
  spots: number;
  spotsLeft: number;
  description: string;
  requirements: string[];
  price: string;
}

export type NewEvent = ParkEvent;
