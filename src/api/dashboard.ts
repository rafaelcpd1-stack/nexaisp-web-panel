import { apiRequest } from "./client";

export type DashboardResponse = {
  metrics: {
    customers: number;
    contracts: number;
    services: number;
    network: number;
  };

  infrastructure: {
    network_nodes: number;
    network_sites: number;
    network_ports: number;
    olt_devices: number;
    nas_devices: number;
  };

  operational: {
    customers: number;
    contracts: number;
    services: number;
    network_assets: number;
  };

  status_summary: {
    network_nodes: {
      healthy: number;
      attention: number;
      offline: number;
    };
    network_ports: {
      healthy: number;
      attention: number;
      offline: number;
    };
    olt_devices: {
      healthy: number;
      attention: number;
      offline: number;
    };
    nas_devices: {
      healthy: number;
      attention: number;
      offline: number;
    };
  };

  financial: {
    invoice_count: number;
    open_invoices: number;
    invoiced_total: number;
    paid_total: number;
    outstanding_total: number;
    payments_total: number;
  };

  alerts: {
    open_tickets: number;
    open_work_orders: number;
    pending_provisioning: number;
    failed_provisioning: number;
  };
};

export async function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>("/api/dashboard");
}
