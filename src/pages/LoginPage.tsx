import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Network,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-brand-panel">
          <div>
            <div className="login-brand">
              <span className="login-brand-mark">N</span>

              <div>
                <strong>NexaISP</strong>
                <small>ERP &amp; BSS</small>
              </div>
            </div>

            <div className="login-brand-content">
              <span className="login-kicker">
                Plataforma para provedores
              </span>

              <h1>
                Gestão completa.
                <br />
                Operação inteligente.
              </h1>

              <p>
                Centralize clientes, contratos, rede, serviços e
                operação do seu provedor em um único ambiente.
              </p>
            </div>
          </div>

          <div className="login-security">
            <div>
              <ShieldCheck size={17} />
              <span>Sessão segura</span>
            </div>

            <div>
              <Network size={17} />
              <span>Core NexaISP</span>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-header">
            <span>Bem-vindo de volta</span>

            <h2>Entrar no NexaISP</h2>

            <p>
              Acesse o painel administrativo do seu provedor.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="login-form"
            noValidate
          >
            <label>
              <span>E-mail</span>

              <div className="login-input">
                <UserRound size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="seu@email.com"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </label>

            <label>
              <span>Senha</span>

              <div className="login-input">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar no painel
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <span>© NexaISP</span>
            <span>Ambiente protegido</span>
          </div>
        </div>
      </section>
    </main>
  );
}
