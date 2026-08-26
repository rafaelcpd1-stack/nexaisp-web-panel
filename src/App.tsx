import {
  useEffect,
  useState,
} from 'react'

import './styles/nexaisp.css'
import './styles/dashboard-polish.css'
import './styles/isp-core.css'

import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard/Dashboard'
import CustomersPro from './pages/customers/CustomersPro'
import CustomerNew from './pages/customers/CustomerNew'
import Network from './pages/network/Network'
import Login from './pages/auth/Login'
import { getSessionUser } from './api/session'

type AuthState =
  | 'checking'
  | 'authenticated'
  | 'guest'

function getPath(): string {
  return (
    window.location.pathname.replace(
      /\/+$/,
      '',
    ) || '/'
  )
}

function App() {
  const [authState, setAuthState] =
    useState<AuthState>('checking')

  useEffect(() => {
    let mounted = true

    void getSessionUser()
      .then(() => {
        if (mounted) {
          setAuthState('authenticated')
        }
      })
      .catch(() => {
        if (mounted) {
          setAuthState('guest')
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  function handleLoginSuccess() {
    setAuthState('authenticated')
  }

  if (authState === 'checking') {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="login-brand-mark">
            N
          </div>

          <strong>Carregando NexaISP</strong>

          <span>
            Validando sua sessão...
          </span>
        </div>
      </div>
    )
  }

  if (authState === 'guest') {
    return (
      <Login
        onSuccess={handleLoginSuccess}
      />
    )
  }

  const path = getPath()

  let page

  if (path === '/clientes/novo') {
    page = <CustomerNew />
  } else if (path === '/clientes') {
    page = <CustomersPro />
  } else if (path === '/rede') {
    page = <Network />
  } else {
    page = <Dashboard />
  }

  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default App
