import api from './client'

export interface PlanFeatureMap {
  [key: string]: unknown
}

export interface NetworkProfile {
  id: string
  company_id: string
  name?: string | null
  code?: string | null
  status?: string | null
  [key: string]: unknown
}

export interface RadiusProfile {
  id: string
  company_id: string
  network_profile_id: string
  name?: string | null
  status?: string | null
  [key: string]: unknown
}

export interface Plan {
  id: string
  company_id: string
  name: string
  code: string
  description: string | null
  download_speed: number | null
  upload_speed: number | null
  price: string
  status: string
  created_at: string
  updated_at: string
  features: PlanFeatureMap
  network_profile: NetworkProfile | null
  radius_profiles: RadiusProfile[]
}

export interface PlanListResponse {
  plans: Plan[]
  total: number
}

export interface PlanFilters {
  search?: string
  status?: string
}

export interface CreatePlanData {
  code: string
  name: string
  description?: string | null
  download_speed?: number | null
  upload_speed?: number | null
  price: number
  status?: string
  features?: PlanFeatureMap
  network_profile_id?: string | null
}

export interface UpdatePlanData {
  code?: string
  name?: string
  description?: string | null
  download_speed?: number | null
  upload_speed?: number | null
  price?: number
  status?: string | null
  features?: PlanFeatureMap
  network_profile_id?: string | null
}

export async function getPlans(
  filters: PlanFilters = {},
): Promise<PlanListResponse> {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.status?.trim()) {
    params.set('status', filters.status.trim())
  }

  const query = params.toString()
  const url = query ? `/api/plans?${query}` : '/api/plans'

  const { data } = await api.get<PlanListResponse>(url)

  return data
}

export async function getPlan(id: string): Promise<Plan> {
  const { data } = await api.get<{ plan: Plan }>(
    `/api/plans/${id}`,
  )

  return data.plan
}

export async function createPlan(
  payload: CreatePlanData,
): Promise<Plan> {
  const { data } = await api.post<{ plan: Plan }>(
    '/api/plans',
    payload,
  )

  return data.plan
}

export async function updatePlan(
  id: string,
  payload: UpdatePlanData,
): Promise<Plan> {
  const { data } = await api.patch<{ plan: Plan }>(
    `/api/plans/${id}`,
    payload,
  )

  return data.plan
}
