import { useEffect, useMemo, useState } from 'react'

import { getCustomers, type Customer } from '../../api/customers'

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
  cancelled: 'Cancelado',
}

function statusLabel(status: string): string {
  return statusLabels[status] ?? status || 'Indefinido'
}

function typeLabel(type: string): string {
  if (type === 'individual') return 'Pessoa física'
  if (type === 'company') return 'Pessoa jurídica'
  return type || 'Não informado'
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'N'
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR')
}

export default function CustomersPro() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const response = await getCustomers({ search, status })
      setCustomers(response.customers)
      setTotal(response.total)
    } catch {
      setError(true)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load()
    }, search ? 250 : 0)
    return () => window.clearTimeout(timer)
  }, [search, status])

  const counts = useMemo(() => {
    return {
      active: customers.filter((customer) => customer.status === 'active').length,
      suspended: customers.filter((customer) => customer.status === 'suspended').length,
      inactive: customers.filter((customer) => customer.status === 'inactive').length,
    }
  }, [customers])

  return (
    <div className="isp-workspace">
      <header className="isp-page-hero">
        <div>
          <span className="isp-kicker">OPERAÇÃO · CADASTROS</span>
          <h1>Clientes</h1>
          <p>Visão operacional da base de assinantes e relacionamento do provedor.</p>
        </div>
        <div className="isp-hero-actions">
          <button className="button button-secondary" type="button" onClick={() => void load()}>
            Atualizar
          </button>
          <button className="button button-primary" type="button" onClick={() => { window.location.href = '/clientes/novo' }}>
            + Novo cliente
          </button>
        </div>
      </header>

      <section className="isp-kpi-grid" aria-label="Resumo da base">
        <article className="isp-kpi-card">
          <span>Total da base</span>
          <strong>{total}</strong>
          <small>clientes encontrados</small>
        </article>
        <article className="isp-kpi-card isp-kpi-positive">
          <span>Ativos</span>
          <strong>{counts.active}</strong>
          <small>na consulta atual</small>
        </article>
        <article className="isp-kpi-card isp-kpi-warning">
          <span>Suspensos</span>
          <strong>{counts.suspended}</strong>
          <small>exigem acompanhamento</small>
        </article>
        <article className="isp-kpi-card">
          <span>Inativos</span>
          <strong>{counts.inactive}</strong>
          <small>fora da operação</small>
        </article>
      </section>

      <section className="isp-panel">
        <div className="isp-panel-header">
          <div>
            <span className="isp-section-label">BASE DE CLIENTES</span>
            <h2>Cadastro operacional</h2>
            <p>Pesquise por cliente ou documento e filtre a situação cadastral.</p>
          </div>
          <span className="isp-live-badge"><i /> Dados online</span>
        </div>

        <div className="isp-filter-bar">
          <label className="isp-search-field">
            <span>Pesquisar</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome, documento ou identificador"
            />
          </label>

          <label className="isp-select-field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="inactive">Inativos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="isp-empty-state">
            <strong>Não foi possível carregar a base.</strong>
            <p>Verifique a sessão e a API do provedor.</p>
            <button className="button button-primary" type="button" onClick={() => void load()}>Tentar novamente</button>
          </div>
        ) : loading ? (
          <div className="isp-empty-state">
            <strong>Consultando clientes…</strong>
            <p>Carregando os dados mais recentes do provedor.</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="isp-empty-state">
            <strong>Nenhum cliente encontrado</strong>
            <p>Ajuste os filtros ou cadastre um novo cliente.</p>
          </div>
        ) : (
          <div className="isp-table-wrap">
            <table className="isp-data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Perfil</th>
                  <th>Documento</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th aria-label="Ações" />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="isp-customer-cell">
                        <span className="isp-avatar">{initials(customer.name)}</span>
                        <div>
                          <strong>{customer.name}</strong>
                          <small>ID {customer.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{typeLabel(customer.type)}</td>
                    <td>{customer.document_number ?? '—'}</td>
                    <td><span className={`isp-status isp-status-${customer.status}`}>{statusLabel(customer.status)}</span></td>
                    <td>{formatDate(customer.created_at)}</td>
                    <td><button className="isp-row-action" type="button">Abrir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
