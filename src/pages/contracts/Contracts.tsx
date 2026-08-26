import { useEffect, useMemo, useState } from 'react'
import {
  getContracts,
  type Contract,
} from '../../api/contracts'

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadContracts() {
    setLoading(true)
    setError('')

    try {
      const response = await getContracts({
        search,
        status,
      })

      setContracts(response.contracts)
      setTotal(response.total)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar os contratos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadContracts()
  }, [status])

  const filteredContracts = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    if (!normalized) {
      return contracts
    }

    return contracts.filter((contract) =>
      [
        contract.number,
        contract.customer_name,
        contract.customer_document_number ?? '',
        contract.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    )
  }, [contracts, search])

  function formatDate(value: string | null) {
    if (!value) {
      return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString('pt-BR')
  }

  function statusLabel(value: string) {
    switch (value) {
      case 'active':
        return 'Ativo'
      case 'suspended':
        return 'Suspenso'
      case 'cancelled':
        return 'Cancelado'
      case 'expired':
        return 'Expirado'
      default:
        return value || '—'
    }
  }

  return (
    <div className="customers-page">
      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <div>
              <span className="section-kicker">NexaISP</span>
              <h1>Contratos</h1>
              <p>
                Gerencie os contratos dos clientes do provedor.
              </p>
            </div>

            <div>
              <strong>{total}</strong>
              <span> contratos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="customers-summary">
        <div>
          <span>Total de contratos</span>
          <strong>{total}</strong>
        </div>

        <div className="customers-summary-status">
          <span>Exibindo</span>
          <strong>{filteredContracts.length}</strong>
        </div>
      </section>

      <section className="customers-panel">
        <div className="customers-toolbar">
          <div className="customers-search">
            <label htmlFor="contracts-search">
              Buscar
            </label>

            <input
              id="contracts-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Número, cliente ou documento..."
            />
          </div>

          <div className="customers-filter">
            <label htmlFor="contracts-status">
              Status
            </label>

            <select
              id="contracts-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="cancelled">Cancelados</option>
              <option value="expired">Expirados</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadContracts()}
          >
            Atualizar
          </button>
        </div>

        {loading ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">…</div>
            <strong>Carregando contratos</strong>
            <p>Aguarde enquanto buscamos os dados.</p>
          </div>
        ) : error ? (
          <div className="customers-error">
            {error}
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">◎</div>
            <strong>Nenhum contrato encontrado</strong>
            <p>
              Não existem contratos correspondentes aos filtros atuais.
            </p>
          </div>
        ) : (
          <>
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Contrato</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Vencimento</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>
                        <strong>{contract.number}</strong>
                      </td>

                      <td>
                        <strong>{contract.customer_name}</strong>
                        <br />
                        <span>
                          {contract.customer_document_number ?? '—'}
                        </span>
                      </td>

                      <td>
                        {statusLabel(contract.status)}
                      </td>

                      <td>
                        {formatDate(contract.starts_at)}
                      </td>

                      <td>
                        {formatDate(contract.ends_at)}
                      </td>

                      <td>
                        {contract.billing_day
                          ? `Dia ${contract.billing_day}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="customers-mobile-list">
              {filteredContracts.map((contract) => (
                <article key={contract.id}>
                  <strong>{contract.number}</strong>

                  <p>{contract.customer_name}</p>

                  <span>
                    {contract.customer_document_number ?? '—'}
                  </span>

                  <span>
                    Status: {statusLabel(contract.status)}
                  </span>

                  <span>
                    Início: {formatDate(contract.starts_at)}
                  </span>

                  <span>
                    Fim: {formatDate(contract.ends_at)}
                  </span>

                  <span>
                    Vencimento:{' '}
                    {contract.billing_day
                      ? `Dia ${contract.billing_day}`
                      : '—'}
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
