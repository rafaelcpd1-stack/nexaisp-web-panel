import api from './client'

export interface SessionUser {
  id: string
  name: string
  email: string
  company_id: string
  status: string
  last_login_at: string | null
}

export interface SessionResponse {
  user: SessionUser
}

export async function getSessionUser(): Promise<SessionUser> {
  const { data } = await api.get<SessionResponse>('/api/me')
  return data.user
}
