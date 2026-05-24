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

export type NewPark = Park;
