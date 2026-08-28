const API_BASE_URL = "";

type RequestOptions = RequestInit & {
  csrf?: boolean;
};

function getXsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    csrf = false,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (csrf) {
    let xsrfToken = getXsrfTokenFromCookie();

    if (!xsrfToken) {
      const csrfResponse = await fetch(`${API_BASE_URL}/api/csrf-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!csrfResponse.ok) {
        throw new Error(
          `Falha ao obter CSRF: HTTP ${csrfResponse.status}`,
        );
      }

      const csrfData = (await csrfResponse.json()) as { token?: string };

      xsrfToken = csrfData.token ?? getXsrfTokenFromCookie();

      if (!xsrfToken) {
        throw new Error("Token CSRF não foi disponibilizado pelo Core.");
      }
    }

    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";

  let payload: unknown = null;

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Erro HTTP ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}
