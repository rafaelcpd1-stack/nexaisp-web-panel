import api from './client'

function extractCsrfToken(html: string): string {
  const document = new DOMParser().parseFromString(
    html,
    'text/html',
  )

  const input = document.querySelector<HTMLInputElement>(
    'input[name="_token"]',
  )

  const token = input?.value?.trim()

  if (!token) {
    throw new Error('Token CSRF não encontrado.')
  }

  return token
}

export async function login(
  email: string,
  password: string,
): Promise<void> {
  const loginPage = await api.get<string>('/login', {
    headers: {
      Accept: 'text/html',
    },
    responseType: 'text',
  })

  const csrf = extractCsrfToken(loginPage.data)

  const form = new URLSearchParams()

  form.set('_token', csrf)
  form.set('email', email)
  form.set('password', password)

  await api.post('/login', form, {
    headers: {
      Accept: 'text/html',
      'Content-Type':
        'application/x-www-form-urlencoded',
    },
  })
}

export async function logout(): Promise<void> {
  await api.post('/logout', null, {
    headers: {
      Accept: 'text/html',
    },
  })

  window.location.href = '/login'
}
