import { apiRequest } from "./client";

export type Customer = {
  id: string;
  type: "individual" | "company" | string;
  name: string;
  document_number: string;
  state_registration: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CustomersResponse = {
  customers: Customer[];
  total: number;
};

export async function getCustomers(): Promise<CustomersResponse> {
  return apiRequest<CustomersResponse>("/api/customers");
}
