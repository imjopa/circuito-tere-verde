import type { NewEvent, NewPark, NewTrail, Park, ParkEvent, Trail } from "@/types";

const API_BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(error?.error ?? `Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  parks: {
    list: () => request<Park[]>("/parks"),
    get: (id: string) => request<Park>(`/parks/${id}`),
    create: (data: NewPark) =>
      request<Park>("/parks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewPark>) =>
      request<Park>(`/parks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<Park>(`/parks/${id}`, { method: "DELETE" }),
  },
  trails: {
    list: () => request<Trail[]>("/trails"),
    get: (id: string) => request<Trail>(`/trails/${id}`),
    create: (data: NewTrail) =>
      request<Trail>("/trails", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewTrail>) =>
      request<Trail>(`/trails/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<Trail>(`/trails/${id}`, { method: "DELETE" }),
  },
  events: {
    list: () => request<ParkEvent[]>("/events"),
    get: (id: string) => request<ParkEvent>(`/events/${id}`),
    create: (data: NewEvent) =>
      request<ParkEvent>("/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<NewEvent>) =>
      request<ParkEvent>(`/events/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<ParkEvent>(`/events/${id}`, { method: "DELETE" }),
  },
};
