import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

export function useTrails() {
  const query = useQuery({
    queryKey: queryKeys.trails,
    queryFn: () => api.trails.list(),
  });

  return {
    trails: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
