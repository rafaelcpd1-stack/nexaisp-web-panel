import { useState } from 'react'
import type { FormEvent } from 'react'
import { login } from '../../api/auth'

interface LoginProps {
  onSuccess: () => void
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (loading) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'E-mail ou senha inválidos.'

      setError(
        message === 'Token CSRF não encontrado.'
          ? message
          : 'E-mail ou senha inválidos.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">N</div>

          <div>
            <div className="login-brand-name">
              NexaISP
            </div>

            <div className="login-brand-subtitle">
              ERP / OSS / BSS
            </div>
          </div>
        </div>

        <div className="login-heading">
          <div className="page-kicker">
            NEXAISP
          </div>

          <h1>Entrar no painel</h1>

          <p>
            Acesse o painel de gestão do seu provedor.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">
              E-mail
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">
              Senha
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="button button-primary login-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Entrando...'
              : 'Entrar no painel'}
          </button>
        </form>

        <div className="login-footer">
          Conexão protegida · sessão Laravel
        </div>
      </div>
    </div>
  )
}
