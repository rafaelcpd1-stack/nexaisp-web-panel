import api from './client'

export interface Contract {
  id: string
  customer_id: string
  number: string
  status: string
  starts_at: string | null
  ends_at: string | null
  billing_day: number | null
  signed_at: string | null
  created_at: string | null
  updated_at: string | null
  customer_name: string
  customer_document_number: string | null
}

export interface ContractListResponse {
  contracts: Contract[]
  total: number
}

export interface ContractFilters {
  search?: string
  status?: string
  customer_id?: string
}

export async function getContracts(
  filters: ContractFilters = {},
): Promise<ContractListResponse> {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.status?.trim()) {
    params.set('status', filters.status.trim())
  }

  if (filters.customer_id?.trim()) {
    params.set('customer_id', filters.customer_id.trim())
  }

  const query = params.toString()
  const url = query ? `/api/contracts?${query}` : '/api/contracts'

  const { data } = await api.get<ContractListResponse>(url)

  return data
}

export async function getContract(id: string): Promise<Contract> {
  const { data } = await api.get<{ contract: Contract }>(
    `/api/contracts/${id}`,
  )

  return data.contract
}

export interface CreateContractData {
  customer_id: string
  number: string
  status?: string
  starts_at: string
  ends_at?: string | null
  billing_day?: number | null
  signed_at?: string | null
}

export async function createContract(
  payload: CreateContractData,
): Promise<Contract> {
  const { data } = await api.post<{ contract: Contract }>(
    '/api/contracts',
    payload,
  )

  return data.contract
}

export interface UpdateContractData {
  customer_id?: string
  number?: string
  status?: string
  starts_at?: string
  ends_at?: string | null
  billing_day?: number | null
  signed_at?: string | null
}

export async function updateContract(
  id: string,
  payload: UpdateContractData,
): Promise<Contract> {
  const { data } = await api.patch<{ contract: Contract }>(
    `/api/contracts/${id}`,
    payload,
  )

  return data.contract
}
