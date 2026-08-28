export class AuthenticationError extends Error {
  constructor(message = "Usuário não autenticado.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  company_id: string;
  status: string;
  last_login_at: string | null;
};

export type MeResponse = {
  user: CurrentUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

function getXsrfToken(): string | null {
  const match = document.cookie.match(
    /(?:^|;\s*)XSRF-TOKEN=([^;]+)/,
  );

  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrf(): Promise<string> {
  const response = await fetch("/api/csrf-token", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Não foi possível inicializar a sessão: HTTP ${response.status}`,
    );
  }

  await response.json();

  const token = getXsrfToken();

  if (!token) {
    throw new Error("Token CSRF não encontrado.");
  }

  return token;
}

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await fetch("/api/me", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    redirect: "follow",
  });

  if (response.redirected) {
    const finalUrl = new URL(
      response.url,
      window.location.origin,
    );

    if (finalUrl.pathname === "/login") {
      throw new AuthenticationError();
    }
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new AuthenticationError(
      `Não autenticado: HTTP ${response.status}`,
    );
  }

  if (!contentType.includes("application/json")) {
    throw new AuthenticationError();
  }

  const payload = (await response.json()) as MeResponse;

  if (!payload.user) {
    throw new AuthenticationError();
  }

  return payload;
}

export async function login(
  credentials: LoginCredentials,
): Promise<MeResponse> {
  const xsrfToken = await ensureCsrf();

  const body = new URLSearchParams();

  body.set("email", credentials.email);
  body.set("password", credentials.password);

  const response = await fetch("/backend/login", {
    method: "POST",
    credentials: "include",
    redirect: "follow",
    headers: {
      Accept: "text/html,application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-XSRF-TOKEN": xsrfToken,
    },
    body,
  });

  if (response.redirected) {
    const finalUrl = new URL(
      response.url,
      window.location.origin,
    );

    if (finalUrl.pathname === "/login") {
      throw new AuthenticationError(
        "E-mail ou senha inválidos.",
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      `Falha no login: HTTP ${response.status}`,
    );
  }

  return getCurrentUser();
}

export async function logout(): Promise<void> {
  const xsrfToken = await ensureCsrf();

  const response = await fetch("/backend/logout", {
    method: "POST",
    credentials: "include",
    redirect: "follow",
    headers: {
      Accept: "text/html,application/json",
      "X-XSRF-TOKEN": xsrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao encerrar sessão: HTTP ${response.status}`,
    );
  }
}
