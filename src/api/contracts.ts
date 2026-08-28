import { apiRequest } from "./client";

export type Contract = Record<string, unknown>;

export type ContractsResponse = {
  contracts: Contract[];
  total: number;
};

export async function getContracts(): Promise<ContractsResponse> {
  return apiRequest<ContractsResponse>("/api/contracts");
}
