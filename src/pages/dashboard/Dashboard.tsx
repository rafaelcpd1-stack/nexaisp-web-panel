import { useEffect, useState } from 'react'
import { getDashboard, type DashboardResponse } from '../../api/dashboard'

const modules = [
  ['01', 'Clientes', 'Cadastro e relacionamento'],
  ['02', 'Contratos', 'Gestão contratual'],
  ['03', 'Financeiro', 'Faturamento e pagamentos'],
  ['04', 'Rede', 'OLT, ONU, PON, NAS e RADIUS'],
  ['05', 'Provisionamento', 'Ativação e configuração'],
  ['06', 'Operações', 'Ordens de serviço e campo'],
]

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse>({
    metrics: {
      customers: 0,
      contracts: 0,
      services: 0,
      network: 0,
    },
    infrastructure: {
      network_nodes: 0,
      network_sites: 0,
      network_ports: 0,
      olt_devices: 0,
      nas_devices: 0,
    },
    operational: {
      customers: 0,
      contracts: 0,
      services: 0,
      network_assets: 0,
    },
    status_summary: {
      network_nodes: {
        healthy: 0,
        attention: 0,
        offline: 0,
      },
      network_ports: {
        healthy: 0,
        attention: 0,
        offline: 0,
      },
      olt_devices: {
        healthy: 0,
        attention: 0,
        offline: 0,
      },
      nas_devices: {
        healthy: 0,
        attention: 0,
        offline: 0,
      },
    },
    financial: {
      invoice_count: 0,
      open_invoices: 0,
      invoiced_total: 0,
      paid_total: 0,
      outstanding_total: 0,
      payments_total: 0,
    },
    alerts: {
      open_tickets: 0,
      open_work_orders: 0,
      pending_provisioning: 0,
      failed_provisioning: 0,
    },
  })

  useEffect(() => {
    void getDashboard()
      .then(setData)
      .catch(() => {
        // Mantém o estado inicial caso a API esteja indisponível.
      })
  }, [])

  const metrics = [
    {
      label: 'Clientes',
      value: data.metrics.customers,
      description: 'Base total de clientes',
      icon: '◉',
      tone: 'blue',
      status: 'Base atual',
    },
    {
      label: 'Contratos',
      value: data.metrics.contracts,
      description: 'Contratos cadastrados',
      icon: '▣',
      tone: 'purple',
      status: 'Contratos',
    },
    {
      label: 'Serviços',
      value: data.metrics.services,
      description: 'Serviços cadastrados',
      icon: '◈',
      tone: 'green',
      status: 'Serviços',
    },
    {
      label: 'Rede',
      value: data.metrics.network,
      description: 'Ativos de infraestrutura',
      icon: '⌁',
      tone: 'amber',
      status: 'Infraestrutura',
    },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-kicker">NEXAISP OPERATIONS</div>
          <h1>Dashboard</h1>
          <p>Visão geral da operação do provedor em um único painel.</p>
        </div>

        <div className="page-actions">
          <button className="button button-primary" type="button">
            Novo cliente
          </button>
        </div>
      </div>

      <div className="welcome-card">
        <div>
          <div className="welcome-kicker">
            <span className="status-dot" />
            SISTEMA ONLINE
          </div>

          <h2>Bem-vindo ao NexaISP</h2>

          <p>
            Acompanhe clientes, contratos, serviços e infraestrutura em um
            único painel operacional. Os módulos serão adicionados
            progressivamente, mantendo cada domínio separado e organizado.
          </p>
        </div>

        <div className="welcome-badge">
          <span className="status-dot" />
          Operação normal
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div
            className={`metric-card metric-card-${metric.tone}`}
            key={metric.label}
          >
            <div className="metric-card-top">
              <div className={`metric-icon metric-icon-${metric.tone}`}>
                {metric.icon}
              </div>

              <span className="metric-status">
                {metric.status}
              </span>
            </div>

            <div className="metric-label">{metric.label}</div>

            <div className="metric-value">
              {metric.value}
            </div>

            <div className="metric-description">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      <section className="dashboard-section">
        <div className="section-card-header">
          <div>
            <div className="section-kicker">INFRAESTRUTURA</div>
            <h3>Saúde da infraestrutura</h3>
            <p>Resumo dos principais ativos cadastrados no provedor.</p>
          </div>

          <span className="section-status">
            <span className="status-dot" />
            Operação normal
          </span>
        </div>

        <div className="infrastructure-grid">
          <div className="infra-card infra-blue">
            <div className="infra-card-heading">
              <span>Nós de rede</span>
              <span className="infra-state infra-state-neutral">
                {data.infrastructure.network_nodes === 0 ? 'Sem ativos' : 'Monitorado'}
              </span>
            </div>
            <strong>{data.infrastructure.network_nodes}</strong>
            <small>
              {data.status_summary.network_nodes.healthy} saudáveis ·{' '}
              {data.status_summary.network_nodes.attention} atenção ·{' '}
              {data.status_summary.network_nodes.offline} offline
            </small>
          </div>

          <div className="infra-card infra-purple">
            <div className="infra-card-heading">
              <span>Sites</span>
              <span className="infra-state infra-state-neutral">
                {data.infrastructure.network_sites === 0 ? 'Sem ativos' : 'Cadastrado'}
              </span>
            </div>
            <strong>{data.infrastructure.network_sites}</strong>
            <small>Locais de infraestrutura</small>
          </div>

          <div className="infra-card infra-green">
            <div className="infra-card-heading">
              <span>Portas</span>
              <span className="infra-state infra-state-green">
                {data.infrastructure.network_ports === 0
                  ? 'Sem portas'
                  : `${data.status_summary.network_ports.healthy} ativas`}
              </span>
            </div>
            <strong>{data.infrastructure.network_ports}</strong>
            <small>
              {data.status_summary.network_ports.healthy} saudáveis ·{' '}
              {data.status_summary.network_ports.attention} atenção ·{' '}
              {data.status_summary.network_ports.offline} offline
            </small>
          </div>

          <div className="infra-card infra-amber">
            <div className="infra-card-heading">
              <span>OLTs</span>
              <span className="infra-state infra-state-amber">
                {data.infrastructure.olt_devices === 0
                  ? 'Sem ativos'
                  : `${data.status_summary.olt_devices.healthy} ativas`}
              </span>
            </div>
            <strong>{data.infrastructure.olt_devices}</strong>
            <small>
              {data.status_summary.olt_devices.healthy} saudáveis ·{' '}
              {data.status_summary.olt_devices.attention} atenção ·{' '}
              {data.status_summary.olt_devices.offline} offline
            </small>
          </div>

          <div className="infra-card infra-red">
            <div className="infra-card-heading">
              <span>NAS</span>
              <span className="infra-state infra-state-red">
                {data.infrastructure.nas_devices === 0
                  ? 'Sem ativos'
                  : `${data.status_summary.nas_devices.healthy} ativos`}
              </span>
            </div>
            <strong>{data.infrastructure.nas_devices}</strong>
            <small>
              {data.status_summary.nas_devices.healthy} saudáveis ·{' '}
              {data.status_summary.nas_devices.attention} atenção ·{' '}
              {data.status_summary.nas_devices.offline} offline
            </small>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card-header">
          <div>
            <div className="section-kicker">VISÃO OPERACIONAL</div>
            <h3>Resumo operacional</h3>
            <p>Indicadores consolidados do ambiente NexaISP.</p>
          </div>
        </div>

        <div className="operational-grid">
          <div className="operational-card">
            <span>Clientes</span>
            <strong>{data.operational.customers}</strong>
            <small>Base cadastrada</small>
          </div>

          <div className="operational-card">
            <span>Contratos</span>
            <strong>{data.operational.contracts}</strong>
            <small>Contratos cadastrados</small>
          </div>

          <div className="operational-card">
            <span>Serviços</span>
            <strong>{data.operational.services}</strong>
            <small>Serviços cadastrados</small>
          </div>

          <div className="operational-card">
            <span>Ativos de rede</span>
            <strong>{data.operational.network_assets}</strong>
            <small>Infraestrutura cadastrada</small>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card-header">
          <div>
            <div className="section-kicker">FINANCEIRO</div>
            <h3>Resumo financeiro</h3>
            <p>Visão consolidada do faturamento e recebimentos.</p>
          </div>
        </div>

        <div className="finance-grid">
          <div className="finance-card finance-blue">
            <span>Faturado</span>
            <strong>
              R$ {data.financial.invoiced_total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>{data.financial.invoice_count} faturas</small>
          </div>

          <div className="finance-card finance-green">
            <span>Recebido</span>
            <strong>
              R$ {data.financial.paid_total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>Valores pagos em faturas</small>
          </div>

          <div className="finance-card finance-amber">
            <span>Em aberto</span>
            <strong>
              R$ {data.financial.outstanding_total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>{data.financial.open_invoices} faturas abertas</small>
          </div>

          <div className="finance-card finance-purple">
            <span>Pagamentos</span>
            <strong>
              R$ {data.financial.payments_total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </strong>
            <small>Total registrado</small>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card-header">
          <div>
            <div className="section-kicker">OPERAÇÃO</div>
            <h3>Atividade operacional</h3>
            <p>Itens que exigem acompanhamento no ambiente do provedor.</p>
          </div>

          <span className="section-status">
            <span className="status-dot" />
            Monitoramento
          </span>
        </div>

        <div className="alerts-grid">
          <div className="alert-card alert-blue">
            <span>Chamados em aberto</span>
            <strong>{data.alerts.open_tickets}</strong>
            <small>Tickets não encerrados</small>
          </div>

          <div className="alert-card alert-amber">
            <span>Ordens em aberto</span>
            <strong>{data.alerts.open_work_orders}</strong>
            <small>Ordens não concluídas</small>
          </div>

          <div className="alert-card alert-purple">
            <span>Provisionamentos</span>
            <strong>{data.alerts.pending_provisioning}</strong>
            <small>Solicitações pendentes</small>
          </div>

          <div className="alert-card alert-red">
            <span>Falhas de provisionamento</span>
            <strong>{data.alerts.failed_provisioning}</strong>
            <small>Solicitações com erro</small>
          </div>
        </div>
      </section>

      <section className="section-card dashboard-section">
        <div className="section-card-header">
          <div>
            <div className="section-kicker">ECOSSISTEMA NEXAISP</div>
            <h3>Estrutura do sistema</h3>
            <p>Módulos organizados por domínio operacional.</p>
          </div>

          <span className="section-status">
            <span className="status-dot" />
            Sistema operacional
          </span>
        </div>

        <div className="module-grid">
          {modules.map(([number, title, description]) => (
            <div className="module-item" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{description}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
