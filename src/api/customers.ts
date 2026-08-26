import api from './client'

export interface Customer {
  id: string
  type: string
  name: string
  document_number: string | null
  state_registration: string | null
  status: string
  created_at: string | null
  updated_at: string | null
}

export interface CustomerListResponse {
  customers: Customer[]
  total: number
}

export interface CustomerFilters {
  search?: string
  status?: string
}

export async function getCustomers(
  filters: CustomerFilters = {},
): Promise<CustomerListResponse> {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.status?.trim()) {
    params.set('status', filters.status.trim())
  }

  const query = params.toString()
  const url = query ? `/api/customers?${query}` : '/api/customers'

  const { data } = await api.get<CustomerListResponse>(url)

  return data
}

export interface CreateCustomerContact {
  type: 'phone' | 'whatsapp' | 'email'
  value: string
  is_primary?: boolean
}

export interface CreateCustomerAddress {
  type?: 'billing'
  postal_code?: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  city: string
  state?: string
  country?: string
}

export interface CreateCustomerData {
  type: 'individual' | 'company'
  name: string
  document_number?: string
  state_registration?: string
  notes?: string
  contacts?: CreateCustomerContact[]
  address?: CreateCustomerAddress
}

export async function createCustomer(
  payload: CreateCustomerData,
): Promise<Customer> {
  const { data } = await api.post<{ customer: Customer }>(
    '/api/customers',
    payload,
  )

  return data.customer
}

export interface CepResponse {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  complement: string
}

export async function getCep(
  cep: string,
): Promise<CepResponse> {
  const digits = cep.replace(/\D/g, '')

  const { data } = await api.get<CepResponse>(
    `/api/cep/${digits}`,
  )

  return data
}

export interface DocumentAvailabilityResponse {
  available: boolean
  exists: boolean
}

export async function checkDocumentAvailability(
  document: string,
  type: 'individual' | 'company',
): Promise<DocumentAvailabilityResponse> {
  const digits = document.replace(/\D/g, '')

  const { data } = await api.get<DocumentAvailabilityResponse>(
    '/api/customers/document-availability',
    {
      params: {
        document: digits,
        type,
      },
    },
  )

  return data
}
