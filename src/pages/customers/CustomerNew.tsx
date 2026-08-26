import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import {
  checkDocumentAvailability,
  createCustomer,
  getCep,
} from '../../api/customers'

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

function formatCnpj(value: string): string {
  const digits = onlyDigits(value).slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
}

function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)

  return digits.replace(/^(\d{5})(\d)/, '$1-$2')
}

function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value)

  if (digits.length !== 11) return false
  if (/^(\\d)\\1{10}$/.test(digits)) return false

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i)
  }

  let digit1 = (sum * 10) % 11
  if (digit1 === 10) digit1 = 0

  if (digit1 !== Number(digits[9])) return false

  sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i)
  }

  let digit2 = (sum * 10) % 11
  if (digit2 === 10) digit2 = 0

  return digit2 === Number(digits[10])
}

function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value)

  if (digits.length !== 14) return false
  if (/^(\\d)\\1{13}$/.test(digits)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0

  for (let i = 0; i < 12; i++) {
    sum += Number(digits[i]) * weights1[i]
  }

  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder

  if (digit1 !== Number(digits[12])) return false

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  sum = 0

  for (let i = 0; i < 13; i++) {
    sum += Number(digits[i]) * weights2[i]
  }

  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder

  return digit2 === Number(digits[13])
}

function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^(\(\d{2}\) \d{4})(\d)/, '$1-$2')
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^(\(\d{2}\) \d{5})(\d)/, '$1-$2')
}

export default function CustomerNew() {
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formType, setFormType] =
    useState<'individual' | 'company'>('individual')

  const [name, setName] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')

  const [documentChecking, setDocumentChecking] = useState(false)
  const [documentExists, setDocumentExists] = useState(false)
  const [documentCheckError, setDocumentCheckError] = useState<string | null>(null)

  const documentDigits = onlyDigits(documentNumber)

  const documentComplete =
    formType === 'individual'
      ? documentDigits.length === 11
      : documentDigits.length === 14

  const documentValid =
    !documentComplete ||
    (formType === 'individual'
      ? isValidCpf(documentDigits)
      : isValidCnpj(documentDigits))
  const [stateRegistration, setStateRegistration] = useState('')

  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')

  const [postalCode, setPostalCode] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('BR')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  const [notes, setNotes] = useState('')

  useEffect(() => {
    setDocumentExists(false)
    setDocumentCheckError(null)

    if (!documentComplete || !documentValid) {
      setDocumentChecking(false)
      return
    }

    let active = true

    setDocumentChecking(true)

    void checkDocumentAvailability(
      documentDigits,
      formType,
    )
      .then((result) => {
        if (!active) return

        setDocumentExists(result.exists)
        setDocumentCheckError(null)
      })
      .catch(() => {
        if (!active) return

        setDocumentExists(false)
        setDocumentCheckError(
          'Não foi possível verificar se o documento já está cadastrado.',
        )
      })
      .finally(() => {
        if (active) {
          setDocumentChecking(false)
        }
      })

    return () => {
      active = false
    }
  }, [
    documentDigits,
    documentComplete,
    documentValid,
    formType,
  ])

  useEffect(() => {
    const digits = postalCode.replace(/\D/g, '')

    if (digits.length !== 8) {
      setCepError(null)
      setCepLoading(false)
      return
    }

    let active = true

    setCepLoading(true)
    setCepError(null)

    void getCep(digits)
      .then((data) => {
        if (!active) return

        setStreet(data.street)
        setNeighborhood(data.neighborhood)
        setCity(data.city)
        setState(data.state)

        if (!complement.trim() && data.complement) {
          setComplement(data.complement)
        }
      })
      .catch(() => {
        if (active) {
          setCepError(
            'CEP não encontrado ou indisponível.',
          )
        }
      })
      .finally(() => {
        if (active) {
          setCepLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [postalCode])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (formLoading) return

    setFormLoading(true)
    setFormError(null)

    try {
      const contacts = [
        phone.trim()
          ? {
              type: 'phone' as const,
              value: phone.trim(),
              is_primary: !email.trim(),
            }
          : null,
        whatsapp.trim()
          ? {
              type: 'whatsapp' as const,
              value: whatsapp.trim(),
              is_primary: false,
            }
          : null,
        email.trim()
          ? {
              type: 'email' as const,
              value: email.trim(),
              is_primary: !phone.trim(),
            }
          : null,
      ].filter((item) => item !== null)

      const hasAddress =
        street.trim() !== '' ||
        city.trim() !== '' ||
        postalCode.trim() !== ''

      await createCustomer({
        type: formType,
        name: name.trim(),
        document_number:
          documentNumber.trim() || undefined,
        state_registration:
          stateRegistration.trim() || undefined,
        notes: notes.trim() || undefined,
        contacts,
        address: hasAddress
          ? {
              type: 'billing',
              postal_code:
                postalCode.trim() || undefined,
              street: street.trim(),
              number: number.trim() || undefined,
              complement:
                complement.trim() || undefined,
              neighborhood:
                neighborhood.trim() || undefined,
              city: city.trim(),
              state: state.trim() || undefined,
              country: country.trim() || 'BR',
            }
          : undefined,
      })

      window.location.href = '/clientes'
    } catch {
      setFormError(
        'Não foi possível cadastrar o cliente. Verifique os dados e tente novamente.',
      )
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="customer-new-page">
      <div className="customer-new-header">
        <div>
          <div className="page-kicker">NEXAISP OPERATION</div>

          <h1>Novo cliente</h1>

          <p>
            Cadastre os dados completos do cliente do provedor.
          </p>
        </div>

        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            window.location.href = '/clientes'
          }}
        >
          Voltar para clientes
        </button>
      </div>

      <form
        className="customer-new-card"
        onSubmit={handleSubmit}
      >
        {formError && (
          <div className="customers-error">
            {formError}
          </div>
        )}

        <section className="customer-form-section">
          <div className="customer-form-section-heading">
            <div>
              <span>01</span>
              <div>
                <strong>Dados principais</strong>
                <small>Identificação do cliente</small>
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
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
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
                {formType === 'company' ? 'CNPJ' : 'CPF'}
              </label>

              <input
                id="customer-document"
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(
                    formType === 'company'
                      ? formatCnpj(event.target.value)
                      : formatCpf(event.target.value),
                  )
                }
                aria-invalid={
                  documentComplete && !documentValid
                }
              />

              {documentComplete && !documentValid && (
                <small className="customer-document-feedback error">
                  {formType === 'company'
                    ? 'CNPJ inválido.'
                    : 'CPF inválido.'}
                </small>
              )}

              {documentComplete &&
                documentValid &&
                documentChecking && (
                  <small className="customer-document-feedback loading">
                    Verificando se já está cadastrado...
                  </small>
                )}

              {documentComplete &&
                documentValid &&
                !documentChecking &&
                documentExists && (
                  <small className="customer-document-feedback error">
                    {formType === 'company'
                      ? 'CNPJ já cadastrado.'
                      : 'CPF já cadastrado.'}
                  </small>
                )}

              {documentComplete &&
                documentValid &&
                !documentChecking &&
                !documentExists &&
                !documentCheckError && (
                  <small className="customer-document-feedback success">
                    {formType === 'company'
                      ? 'CNPJ disponível.'
                      : 'CPF disponível.'}
                  </small>
                )}

              {documentCheckError && (
                <small className="customer-document-feedback error">
                  {documentCheckError}
                </small>
              )}
            </div>

            <div className="customer-form-field">
              <label htmlFor="customer-state-registration">
                Inscrição estadual
              </label>

              <input
                id="customer-state-registration"
                value={stateRegistration}
                onChange={(event) =>
                  setStateRegistration(event.target.value)
                }
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
                <small>Telefone, WhatsApp e e-mail</small>
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
                value={phone}
                onChange={(event) =>
                  setPhone(formatPhone(event.target.value))
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
                value={whatsapp}
                onChange={(event) =>
                  setWhatsapp(formatPhone(event.target.value))
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
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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
                <small>Endereço de cobrança</small>
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
                value={postalCode}
                onChange={(event) =>
                  setPostalCode(formatCep(event.target.value))
                }
                placeholder="00000-000"
                inputMode="numeric"
                autoComplete="postal-code"
              />

              {cepLoading && (
                <small className="customer-cep-feedback loading">
                  Consultando CEP...
                </small>
              )}

              {!cepLoading && cepError && (
                <small className="customer-cep-feedback error">
                  {cepError}
                </small>
              )}

              {!cepLoading &&
                !cepError &&
                postalCode.replace(/\D/g, '').length === 8 && (
                  <small className="customer-cep-feedback success">
                    Endereço encontrado
                  </small>
                )}
            </div>

            <div className="customer-form-field">
              <label htmlFor="customer-state">
                Estado
              </label>

              <input
                id="customer-state"
                value={state}
                onChange={(event) =>
                  setState(event.target.value)
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
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
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
                value={neighborhood}
                onChange={(event) =>
                  setNeighborhood(event.target.value)
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
                value={street}
                onChange={(event) =>
                  setStreet(event.target.value)
                }
                placeholder="Logradouro"
                required={Boolean(city.trim())}
              />
            </div>

            <div className="customer-form-field">
              <label htmlFor="customer-number">
                Número
              </label>

              <input
                id="customer-number"
                value={number}
                onChange={(event) =>
                  setNumber(event.target.value)
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
                value={complement}
                onChange={(event) =>
                  setComplement(event.target.value)
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
                value={country}
                onChange={(event) =>
                  setCountry(event.target.value)
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
                <small>Informações adicionais</small>
              </div>
            </div>
          </div>

          <div className="customer-form-field">
            <label htmlFor="customer-notes">
              Observações
            </label>

            <textarea
              id="customer-notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={5}
              placeholder="Adicione informações relevantes sobre o cliente."
            />
          </div>
        </section>

        <div className="customer-new-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              window.location.href = '/clientes'
            }}
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
  )
}
