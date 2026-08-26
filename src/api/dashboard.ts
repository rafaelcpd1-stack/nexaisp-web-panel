import api from './client'

export interface DashboardMetrics {
  customers: number
  contracts: number
  services: number
  network: number
}

export interface DashboardInfrastructure {
  network_nodes: number
  network_sites: number
  network_ports: number
  olt_devices: number
  nas_devices: number
}

export interface DashboardOperational {
  customers: number
  contracts: number
  services: number
  network_assets: number
}

export interface DashboardStatus {
  healthy: number
  attention: number
  offline: number
}

export interface DashboardStatusSummary {
  network_nodes: DashboardStatus
  network_ports: DashboardStatus
  olt_devices: DashboardStatus
  nas_devices: DashboardStatus
}

export interface DashboardFinancial {
  invoice_count: number
  open_invoices: number
  invoiced_total: number
  paid_total: number
  outstanding_total: number
  payments_total: number
}

export interface DashboardAlerts {
  open_tickets: number
  open_work_orders: number
  pending_provisioning: number
  failed_provisioning: number
}

export interface DashboardResponse {
  metrics: DashboardMetrics
  infrastructure: DashboardInfrastructure
  operational: DashboardOperational
  status_summary: DashboardStatusSummary
  financial: DashboardFinancial
  alerts: DashboardAlerts
}

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await api.get<DashboardResponse>('/api/dashboard')
  return data
}
