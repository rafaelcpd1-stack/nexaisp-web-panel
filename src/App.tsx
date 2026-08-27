import {
  useEffect,
  useState,
} from 'react'

import './styles/nexaisp.css'
import './styles/dashboard-polish.css'

import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Customers from './pages/customers/Customers'
import CustomerNew from './pages/customers/CustomerNew'
import Contracts from './pages/contracts/Contracts'
import Services from './pages/services/Services'
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

  const [path, setPath] = useState(getPath)

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

  useEffect(() => {
    function handlePopState() {
      setPath(getPath())
    }

    window.addEventListener(
      'popstate',
      handlePopState,
    )

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState,
      )
    }
  }, [])

  function navigate(to: string) {
    if (to === window.location.pathname) {
      return
    }

    window.history.pushState({}, '', to)
    setPath(to)
  }

  function handleLoginSuccess() {
    setAuthState('authenticated')
    navigate('/')
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

  let page

  if (path === '/clientes/novo') {
    page = (
      <CustomerNew
        onNavigate={navigate}
      />
    )
  } else if (path === '/clientes') {
    page = (
      <Customers
        onNavigate={navigate}
      />
    )
  } else if (path === '/contratos') {
    page = <Contracts />
  } else if (path === '/servicos') {
    page = <Services />
  } else {
    page = <Dashboard />
  }

  return (
    <AppLayout onNavigate={navigate}>
      {page}
    </AppLayout>
  )
}

export default App
