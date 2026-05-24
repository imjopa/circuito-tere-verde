import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { events as initialEvents, type ParkEvent } from "@/data/events";
import { trails as initialTrails, type Trail } from "@/data/trails";

type AdminDataContextValue = {
  trailsData: Trail[];
  setTrailsData: Dispatch<SetStateAction<Trail[]>>;
  eventsData: ParkEvent[];
  setEventsData: Dispatch<SetStateAction<ParkEvent[]>>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [trailsData, setTrailsData] = useState(initialTrails);
  const [eventsData, setEventsData] = useState(initialEvents);

  const contextValue = useMemo(
    () => ({
      trailsData,
      setTrailsData,
      eventsData,
      setEventsData,
    }),
    [trailsData, setTrailsData, eventsData, setEventsData],
  );

  return <AdminDataContext.Provider value={contextValue}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData deve ser usado dentro de AdminDataProvider");
  }
  return context;
}
