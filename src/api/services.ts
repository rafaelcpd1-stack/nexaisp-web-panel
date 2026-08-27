import api from './client'

export interface Service {
  id: string
  company_id: string
  customer_id: string
  customer_name: string
  contract_id: string
  contract_number: string
  plan_id: string
  plan_name: string
  plan_code: string
  plan_price: string
  service_number: string
  status: string
  activated_at: string | null
  suspended_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface ServiceListResponse {
  services: Service[]
  total: number
}

export interface ServiceFilters {
  search?: string
  status?: string
  customer_id?: string
  contract_id?: string
  plan_id?: string
}

export async function getServices(
  filters: ServiceFilters = {},
): Promise<ServiceListResponse> {
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

  if (filters.contract_id?.trim()) {
    params.set('contract_id', filters.contract_id.trim())
  }

  if (filters.plan_id?.trim()) {
    params.set('plan_id', filters.plan_id.trim())
  }

  const query = params.toString()
  const url = query ? `/api/services?${query}` : '/api/services'

  const { data } = await api.get<ServiceListResponse>(url)

  return data
}

export async function getService(id: string): Promise<Service> {
  const { data } = await api.get<{ service: Service }>(
    `/api/services/${id}`,
  )

  return data.service
}
