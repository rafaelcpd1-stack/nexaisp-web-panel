import { apiRequest } from "./client";

export type Service = Record<string, unknown>;

export type ServicesResponse = {
  services: Service[];
  total: number;
};

export async function getServices(): Promise<ServicesResponse> {
  return apiRequest<ServicesResponse>("/api/services");
}
