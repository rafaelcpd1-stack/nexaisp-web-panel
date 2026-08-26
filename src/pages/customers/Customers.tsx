import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import {
  createCustomer,
  getCustomers,
  type Customer,
} from '../../api/customers'

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
  cancelled: 'Cancelado',
}

function formatType(type: string): string {
  if (type === 'company') return 'PJ'
  if (type === 'individual') return 'PF'
  return type || '—'
}

function formatStatus(status: string): string {
  return statusLabels[status] ?? (status || '—')
}

function formatDate(value: string | null): string {
  if (!value) return '—'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('pt-BR')
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formType, setFormType] =
    useState<'individual' | 'company'>('individual')

  const [formName, setFormName] = useState('')
  const [formDocument, setFormDocument] = useState('')
  const [formStateRegistration, setFormStateRegistration] = useState('')

  const [formPhone, setFormPhone] = useState('')
  const [formWhatsapp, setFormWhatsapp] = useState('')
  const [formEmail, setFormEmail] = useState('')

  const [formPostalCode, setFormPostalCode] = useState('')
  const [formStreet, setFormStreet] = useState('')
  const [formNumber, setFormNumber] = useState('')
  const [formComplement, setFormComplement] = useState('')
  const [formNeighborhood, setFormNeighborhood] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formState, setFormState] = useState('')
  const [formCountry, setFormCountry] = useState('BR')

  const [formNotes, setFormNotes] = useState('')

  async function loadCustomers() {
    setLoading(true)

    try {
      const response = await getCustomers({
        search,
        status,
      })

      setCustomers(response.customers)
      setTotal(response.total)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCustomers().catch(() => {
      setLoading(false)
    })
  }, [search, status])

  function resetForm() {
    setFormType('individual')
    setFormName('')
    setFormDocument('')
    setFormStateRegistration('')

    setFormPhone('')
    setFormWhatsapp('')
    setFormEmail('')

    setFormPostalCode('')
    setFormStreet('')
    setFormNumber('')
    setFormComplement('')
    setFormNeighborhood('')
    setFormCity('')
    setFormState('')
    setFormCountry('BR')

    setFormNotes('')
    setFormError(null)
  }

  function openForm() {
    resetForm()
    setFormOpen(true)
  }

  function closeForm() {
    if (formLoading) return

    setFormOpen(false)
    resetForm()
  }

  async function handleCreateCustomer(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (formLoading) return

    setFormLoading(true)
    setFormError(null)

    try {
      const contacts = [
        formPhone.trim()
          ? {
              type: 'phone' as const,
              value: formPhone.trim(),
              is_primary: !formEmail.trim(),
            }
          : null,

        formWhatsapp.trim()
          ? {
              type: 'whatsapp' as const,
              value: formWhatsapp.trim(),
              is_primary: false,
            }
          : null,

        formEmail.trim()
          ? {
              type: 'email' as const,
              value: formEmail.trim(),
              is_primary: !formPhone.trim(),
            }
          : null,
      ].filter(
        (
          item,
        ): item is {
          type: 'phone' | 'whatsapp' | 'email'
          value: string
          is_primary: boolean
        } => item !== null,
      )

      const hasAddress =
        formStreet.trim() !== '' ||
        formCity.trim() !== '' ||
        formPostalCode.trim() !== ''

      const customer = await createCustomer({
        type: formType,
        name: formName.trim(),
        document_number:
          formDocument.trim() || undefined,
        state_registration:
          formStateRegistration.trim() || undefined,
        notes: formNotes.trim() || undefined,
        contacts,
        address: hasAddress
          ? {
              type: 'billing',
              postal_code:
                formPostalCode.trim() || undefined,
              street: formStreet.trim(),
              number:
                formNumber.trim() || undefined,
              complement:
                formComplement.trim() || undefined,
              neighborhood:
                formNeighborhood.trim() || undefined,
              city: formCity.trim(),
              state:
                formState.trim() || undefined,
              country: formCountry.trim() || 'BR',
            }
          : undefined,
      } as Parameters<typeof createCustomer>[0])

      setCustomers((current) => [customer, ...current])
      setTotal((current) => current + 1)

      closeForm()
    } catch {
      setFormError(
        'Não foi possível cadastrar o cliente. Verifique os dados e tente novamente.',
      )
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <div className="page-kicker">
            NEXAISP OPERATION
          </div>

          <h1>Clientes</h1>

          <p>
            Cadastro e relacionamento dos clientes do provedor.
          </p>
        </div>

        <div className="page-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              window.location.href = '/clientes/novo'
            }}
          >
            Novo cliente
          </button>
        </div>
      </div>

      <section className="customers-summary">
        <div>
          <span>Total de clientes</span>
          <strong>{total}</strong>
        </div>

        <div className="customers-summary-status">
          <span className="status-dot" />
          Base sincronizada
        </div>
      </section>

      <section className="customers-panel">
        <div className="customers-toolbar">
          <div className="customers-search">
            <label htmlFor="customer-search">Buscar</label>

            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Nome ou documento"
            />
          </div>

          <div className="customers-filter">
            <label htmlFor="customer-status">Status</label>

            <select
              id="customer-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="suspended">Suspensos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">…</div>
            <strong>Carregando clientes</strong>
            <p>Consultando a base do provedor.</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">◎</div>

            <strong>Nenhum cliente encontrado</strong>

            <p>
              A base ainda não possui clientes para os filtros
              selecionados.
            </p>

            <button
              className="button button-primary"
              type="button"
              onClick={openForm}
            >
              Cadastrar primeiro cliente
            </button>
          </div>
        ) : (
          <>
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Documento</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-name">
                          {customer.name}
                        </div>

                        <div className="customer-id">
                          {customer.id}
                        </div>
                      </td>

                      <td>{formatType(customer.type)}</td>

                      <td>
                        {customer.document_number ?? '—'}
                      </td>

                      <td>
                        <span
                          className={`customer-status customer-status-${customer.status}`}
                        >
                          {formatStatus(customer.status)}
                        </span>
                      </td>

                      <td>{formatDate(customer.created_at)}</td>

                      <td>
                        <button
                          className="customer-action"
                          type="button"
                        >
                          Abrir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="customers-mobile-list">
              {customers.map((customer) => (
                <article
                  className="customer-mobile-card"
                  key={customer.id}
                >
                  <div className="customer-mobile-top">
                    <strong>{customer.name}</strong>

                    <span
                      className={`customer-status customer-status-${customer.status}`}
                    >
                      {formatStatus(customer.status)}
                    </span>
                  </div>

                  <div className="customer-mobile-meta">
                    <span>
                      Tipo: {formatType(customer.type)}
                    </span>

                    <span>
                      Documento:{' '}
                      {customer.document_number ?? '—'}
                    </span>

                    <span>
                      Cadastro:{' '}
                      {formatDate(customer.created_at)}
                    </span>
                  </div>

                  <button
                    className="customer-action customer-action-mobile"
                    type="button"
                  >
                    Abrir cliente
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {formOpen && (
        <div className="customer-modal-backdrop">
          <div
            className="customer-modal customer-modal-large"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
          >
            <div className="customer-modal-header">
              <div>
                <div className="section-kicker">
                  CADASTRO DE CLIENTE
                </div>

                <h2 id="customer-modal-title">
                  Novo cliente
                </h2>

                <p>
                  Cadastro completo do cliente do provedor.
                </p>
              </div>

              <button
                className="customer-modal-close"
                type="button"
                onClick={closeForm}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="customers-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCustomer}>
              <section className="customer-form-section">
                <div className="customer-form-section-heading">
                  <div>
                    <span>01</span>
                    <div>
                      <strong>Dados principais</strong>
                      <small>
                        Identificação do cliente
                      </small>
                    </div>
                  </div>
                </div>

                <div className="customer-type-switch">
                  <button
                    type="button"
                    className={
                      formType === 'individual'
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setFormType('individual')
                    }
                  >
                    <strong>Pessoa Física</strong>
                    <small>CPF</small>
                  </button>

                  <button
                    type="button"
                    className={
                      formType === 'company'
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setFormType('company')
                    }
                  >
                    <strong>Pessoa Jurídica</strong>
                    <small>CNPJ</small>
                  </button>
                </div>

                <div className="customer-form-grid">
                  <div className="customer-form-field customer-form-field-full">
                    <label htmlFor="customer-name">
                      {formType === 'company'
                        ? 'Razão social'
                        : 'Nome completo'}
                    </label>

                    <input
                      id="customer-name"
                      value={formName}
                      onChange={(event) =>
                        setFormName(event.target.value)
                      }
                      placeholder={
                        formType === 'company'
                          ? 'Digite a razão social'
                          : 'Digite o nome completo'
                      }
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-document">
                      {formType === 'company'
                        ? 'CNPJ'
                        : 'CPF'}
                    </label>

                    <input
                      id="customer-document"
                      value={formDocument}
                      onChange={(event) =>
                        setFormDocument(event.target.value)
                      }
                      placeholder={
                        formType === 'company'
                          ? '00.000.000/0000-00'
                          : '000.000.000-00'
                      }
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-state-registration">
                      Inscrição estadual
                    </label>

                    <input
                      id="customer-state-registration"
                      value={formStateRegistration}
                      onChange={(event) =>
                        setFormStateRegistration(
                          event.target.value,
                        )
                      }
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </section>

              <section className="customer-form-section">
                <div className="customer-form-section-heading">
                  <div>
                    <span>02</span>
                    <div>
                      <strong>Contatos</strong>
                      <small>
                        Telefone, WhatsApp e e-mail
                      </small>
                    </div>
                  </div>
                </div>

                <div className="customer-form-grid">
                  <div className="customer-form-field">
                    <label htmlFor="customer-phone">
                      Telefone
                    </label>

                    <input
                      id="customer-phone"
                      value={formPhone}
                      onChange={(event) =>
                        setFormPhone(event.target.value)
                      }
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-whatsapp">
                      WhatsApp
                    </label>

                    <input
                      id="customer-whatsapp"
                      value={formWhatsapp}
                      onChange={(event) =>
                        setFormWhatsapp(event.target.value)
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="customer-form-field customer-form-field-full">
                    <label htmlFor="customer-email">
                      E-mail
                    </label>

                    <input
                      id="customer-email"
                      type="email"
                      value={formEmail}
                      onChange={(event) =>
                        setFormEmail(event.target.value)
                      }
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              </section>

              <section className="customer-form-section">
                <div className="customer-form-section-heading">
                  <div>
                    <span>03</span>
                    <div>
                      <strong>Endereço principal</strong>
                      <small>
                        Endereço de cobrança
                      </small>
                    </div>
                  </div>
                </div>

                <div className="customer-form-grid">
                  <div className="customer-form-field">
                    <label htmlFor="customer-postal-code">
                      CEP
                    </label>

                    <input
                      id="customer-postal-code"
                      value={formPostalCode}
                      onChange={(event) =>
                        setFormPostalCode(
                          event.target.value,
                        )
                      }
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-state">
                      Estado
                    </label>

                    <input
                      id="customer-state"
                      value={formState}
                      onChange={(event) =>
                        setFormState(event.target.value)
                      }
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-city">
                      Cidade
                    </label>

                    <input
                      id="customer-city"
                      value={formCity}
                      onChange={(event) =>
                        setFormCity(event.target.value)
                      }
                      placeholder="Cidade"
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-neighborhood">
                      Bairro
                    </label>

                    <input
                      id="customer-neighborhood"
                      value={formNeighborhood}
                      onChange={(event) =>
                        setFormNeighborhood(
                          event.target.value,
                        )
                      }
                      placeholder="Bairro"
                    />
                  </div>

                  <div className="customer-form-field customer-form-field-wide">
                    <label htmlFor="customer-street">
                      Rua
                    </label>

                    <input
                      id="customer-street"
                      value={formStreet}
                      onChange={(event) =>
                        setFormStreet(event.target.value)
                      }
                      placeholder="Logradouro"
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-number">
                      Número
                    </label>

                    <input
                      id="customer-number"
                      value={formNumber}
                      onChange={(event) =>
                        setFormNumber(event.target.value)
                      }
                      placeholder="Número"
                    />
                  </div>

                  <div className="customer-form-field customer-form-field-full">
                    <label htmlFor="customer-complement">
                      Complemento
                    </label>

                    <input
                      id="customer-complement"
                      value={formComplement}
                      onChange={(event) =>
                        setFormComplement(
                          event.target.value,
                        )
                      }
                      placeholder="Apartamento, bloco, referência..."
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="customer-country">
                      País
                    </label>

                    <input
                      id="customer-country"
                      value={formCountry}
                      onChange={(event) =>
                        setFormCountry(event.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="customer-form-section">
                <div className="customer-form-section-heading">
                  <div>
                    <span>04</span>
                    <div>
                      <strong>Observações</strong>
                      <small>
                        Informações adicionais
                      </small>
                    </div>
                  </div>
                </div>

                <div className="customer-form-field">
                  <textarea
                    id="customer-notes"
                    value={formNotes}
                    onChange={(event) =>
                      setFormNotes(event.target.value)
                    }
                    rows={4}
                    placeholder="Adicione informações relevantes sobre o cliente."
                  />
                </div>
              </section>

              <div className="customer-modal-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                >
                  Cancelar
                </button>

                <button
                  className="button button-primary"
                  type="submit"
                  disabled={formLoading}
                >
                  {formLoading
                    ? 'Cadastrando...'
                    : 'Cadastrar cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
