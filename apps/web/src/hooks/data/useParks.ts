import type { Park } from "@circuito/db/client";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export function useParks() {
  return useQuery({
    queryKey: ["parks"],
    queryFn: () => ky.get("/api/parks").json<Park[]>(),
  });
}
