import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

export function useParks() {
  const query = useQuery({
    queryKey: queryKeys.parks,
    queryFn: () => api.parks.list(),
  });

  return {
    parks: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
