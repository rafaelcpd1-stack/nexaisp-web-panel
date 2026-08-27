import { useEffect, useState } from 'react'
import {
  getPlans,
  type Plan,
} from '../../api/plans'

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

function formatSpeed(value: number | null): string {
  if (value === null) {
    return '—'
  }

  return `${value} Mbps`
}

function statusLabel(value: string): string {
  switch (value) {
    case 'active':
      return 'Ativo'
    case 'inactive':
      return 'Inativo'
    case 'suspended':
      return 'Suspenso'
    default:
      return value || '—'
  }
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadPlans() {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlans({
        search,
        status,
      })

      setPlans(response.plans)
      setTotal(response.total)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar os planos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPlans()
  }, [status])

  return (
    <div className="customers-page">
      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <span className="section-kicker">NexaISP</span>
              <h1>Planos</h1>
              <p>
                Catálogo comercial de planos de Internet do provedor.
              </p>
            </div>

            <div>
              <strong>{total}</strong>
              <span> planos</span>
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
          <strong>{plans.length}</strong>
        </div>
      </section>

      <section className="customers-panel">
        <div className="customers-toolbar">
          <div className="customers-search">
            <label htmlFor="plans-search">
              Buscar
            </label>

            <input
              id="plans-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadPlans()
                }
              }}
              placeholder="Nome ou código do plano..."
            />
          </div>

          <div className="customers-filter">
            <label htmlFor="plans-status">
              Status
            </label>

            <select
              id="plans-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="suspended">Suspensos</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadPlans()}
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">…</div>
            <strong>Carregando planos</strong>
            <span>
              Aguarde enquanto os dados são consultados.
            </span>
          </div>
        ) : error ? (
          <div className="customers-error">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">◎</div>
            <strong>Nenhum plano encontrado</strong>
            <span>
              Não existem planos correspondentes aos filtros atuais.
            </span>
          </div>
        ) : (
          <>
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Plano</th>
                    <th>Velocidade</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th>Rede</th>
                  </tr>
                </thead>

                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td>
                        <strong>{plan.name}</strong>
                        <br />
                        <span>{plan.code}</span>
                      </td>

                      <td>
                        <strong>
                          {formatSpeed(plan.download_speed)}
                        </strong>
                        <br />
                        <span>
                          Upload: {formatSpeed(plan.upload_speed)}
                        </span>
                      </td>

                      <td>
                        {formatPrice(plan.price)}
                      </td>

                      <td>
                        {statusLabel(plan.status)}
                      </td>

                      <td>
                        <strong>
                          {plan.network_profile?.name || 'Sem perfil'}
                        </strong>
                        <br />
                        <span>
                          {plan.radius_profiles.length} perfil(is) RADIUS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="customers-mobile-list">
              {plans.map((plan) => (
                <article key={plan.id}>
                  <strong>{plan.name}</strong>

                  <p>{plan.code}</p>

                  {plan.description && (
                    <span>{plan.description}</span>
                  )}

                  <span>
                    Download: {formatSpeed(plan.download_speed)}
                  </span>

                  <span>
                    Upload: {formatSpeed(plan.upload_speed)}
                  </span>

                  <span>
                    Preço: {formatPrice(plan.price)}
                  </span>

                  <span>
                    Status: {statusLabel(plan.status)}
                  </span>

                  <span>
                    Perfil de rede:{' '}
                    {plan.network_profile?.name || 'Sem perfil'}
                  </span>

                  <span>
                    RADIUS: {plan.radius_profiles.length} perfil(is)
                  </span>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
