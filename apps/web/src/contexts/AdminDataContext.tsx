import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ParkEvent, Trail, TrailStatus } from "@/types";

type AdminDataContextValue = {
  trailsData: Trail[];
  eventsData: ParkEvent[];
  loading: boolean;
  error: string | null;
  updateTrail: (id: string, data: { status: TrailStatus; conditions: string }) => Promise<void>;
  deleteTrail: (id: string) => Promise<void>;
  updateEvent: (
    id: string,
    data: { status: ParkEvent["status"]; spotsLeft: number },
  ) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const trailsQuery = useQuery({
    queryKey: queryKeys.trails,
    queryFn: () => api.trails.list(),
  });

  const eventsQuery = useQuery({
    queryKey: queryKeys.events,
    queryFn: () => api.events.list(),
  });

  const updateTrailMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: TrailStatus; conditions: string } }) =>
      api.trails.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trails }),
  });

  const deleteTrailMutation = useMutation({
    mutationFn: (id: string) => api.trails.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trails }),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: ParkEvent["status"]; spotsLeft: number };
    }) => api.events.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.events }),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => api.events.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.events }),
  });

  const loading = trailsQuery.isLoading || eventsQuery.isLoading;
  const error =
    (trailsQuery.error instanceof Error ? trailsQuery.error.message : null) ??
    (eventsQuery.error instanceof Error ? eventsQuery.error.message : null);

  const contextValue = useMemo(
    () => ({
      trailsData: trailsQuery.data ?? [],
      eventsData: eventsQuery.data ?? [],
      loading,
      error,
      updateTrail: async (id: string, data: { status: TrailStatus; conditions: string }) => {
        await updateTrailMutation.mutateAsync({ id, data });
      },
      deleteTrail: async (id: string) => {
        await deleteTrailMutation.mutateAsync(id);
      },
      updateEvent: async (id: string, data: { status: ParkEvent["status"]; spotsLeft: number }) => {
        await updateEventMutation.mutateAsync({ id, data });
      },
      deleteEvent: async (id: string) => {
        await deleteEventMutation.mutateAsync(id);
      },
    }),
    [
      trailsQuery.data,
      eventsQuery.data,
      loading,
      error,
      updateTrailMutation,
      deleteTrailMutation,
      updateEventMutation,
      deleteEventMutation,
    ],
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
