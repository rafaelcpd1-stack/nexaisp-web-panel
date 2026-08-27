import { useEffect, useState } from 'react'
import {
  getServices,
  type Service,
} from '../../api/services'

interface ServicesProps {
  onNavigate?: (to: string) => void
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('pt-BR')
}

function statusLabel(value: string): string {
  switch (value) {
    case 'active':
      return 'Ativo'
    case 'pending':
      return 'Pendente'
    case 'suspended':
      return 'Suspenso'
    case 'cancelled':
      return 'Cancelado'
    case 'expired':
      return 'Expirado'
    case 'provisioned':
      return 'Provisionado'
    default:
      return value || '—'
  }
}

function formatPrice(value: string): string {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return value
  }

  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function Services({ onNavigate }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadServices() {
    setLoading(true)
    setError(null)

    try {
      const response = await getServices({
        search,
        status,
      })

      setServices(response.services)
      setTotal(response.total)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar os serviços.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadServices()
  }, [status])

  return (
    <div className="customers-page">
      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <span className="section-kicker">NexaISP</span>
              <h1>Serviços</h1>
              <p>
                Gerencie os serviços contratados pelos clientes do provedor.
              </p>
            </div>

            <div>
              <strong>{total}</strong>
              <span> serviços</span>
            </div>
          </div>
        </div>
      </section>

      <section className="customers-summary">
        <div>
          <span>Total encontrado</span>
          <strong>{total}</strong>
        </div>

        <div className="customers-summary-status">
          <span>Exibindo</span>
          <strong>{services.length}</strong>
        </div>
      </section>

      <section className="customers-panel">
        <div className="customers-toolbar">
          <div className="customers-search">
            <label htmlFor="services-search">
              Buscar
            </label>

            <input
              id="services-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadServices()
                }
              }}
              placeholder="Número, cliente, contrato ou plano..."
            />
          </div>

          <div className="customers-filter">
            <label htmlFor="services-status">
              Status
            </label>

            <select
              id="services-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="active">Ativos</option>
              <option value="provisioned">Provisionados</option>
              <option value="suspended">Suspensos</option>
              <option value="cancelled">Cancelados</option>
              <option value="expired">Expirados</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadServices()}
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">…</div>
            <strong>Carregando serviços</strong>
            <span>
              Aguarde enquanto os dados são consultados.
            </span>
          </div>
        ) : error ? (
          <div className="customers-error">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">◎</div>
            <strong>Nenhum serviço encontrado</strong>
            <span>
              Não existem serviços correspondentes aos filtros atuais.
            </span>
          </div>
        ) : (
          <>
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Cliente</th>
                    <th>Contrato</th>
                    <th>Plano</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ativação</th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <strong>{service.service_number}</strong>
                        <br />
                        <span>{service.id}</span>
                      </td>

                      <td>
                        <strong>{service.customer_name}</strong>
                        <br />
                        <span>{service.customer_id}</span>
                      </td>

                      <td>
                        <strong>{service.contract_number}</strong>
                        <br />
                        <span>{service.contract_id}</span>
                      </td>

                      <td>
                        <strong>{service.plan_name}</strong>
                        <br />
                        <span>{service.plan_code}</span>
                      </td>

                      <td>
                        {formatPrice(service.plan_price)}
                      </td>

                      <td>
                        {statusLabel(service.status)}
                      </td>

                      <td>
                        {formatDate(service.activated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="customers-mobile-list">
              {services.map((service) => (
                <article key={service.id}>
                  <strong>{service.service_number}</strong>

                  <p>{service.customer_name}</p>

                  <span>
                    Contrato: {service.contract_number}
                  </span>

                  <span>
                    Plano: {service.plan_name}
                  </span>

                  <span>
                    Código do plano: {service.plan_code}
                  </span>

                  <span>
                    Valor: {formatPrice(service.plan_price)}
                  </span>

                  <span>
                    Status: {statusLabel(service.status)}
                  </span>

                  <span>
                    Ativação: {formatDate(service.activated_at)}
                  </span>

                  {service.suspended_at && (
                    <span>
                      Suspensão: {formatDate(service.suspended_at)}
                    </span>
                  )}

                  {service.cancelled_at && (
                    <span>
                      Cancelamento: {formatDate(service.cancelled_at)}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {onNavigate && (
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  )
}
