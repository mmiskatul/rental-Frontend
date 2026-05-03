const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ACCESS_TOKEN_KEY = "driveflow_access_token";
const REFRESH_TOKEN_KEY = "driveflow_refresh_token";

export type ApiError = Error & { status?: number };

let accessToken: string | null = readStoredToken(ACCESS_TOKEN_KEY);
let refreshToken: string | null = readStoredToken(REFRESH_TOKEN_KEY);

export function setAccessToken(token: string | null) {
  accessToken = token;
  storeToken(ACCESS_TOKEN_KEY, token);
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
  storeToken(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return refreshToken;
}

function readStoredToken(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function storeToken(key: string, token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(key, token);
    return;
  }
  window.localStorage.removeItem(key);
}

type ValidationError = {
  loc?: Array<string | number>;
  msg?: string;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const baseHeaders = new Headers(options.headers);
  if (accessToken && !baseHeaders.has("Authorization")) {
    baseHeaders.set("Authorization", `Bearer ${accessToken}`);
  }
  if (!isFormData && !baseHeaders.has("Content-Type")) {
    baseHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: baseHeaders,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(formatApiError(data.detail)) as ApiError;
    error.status = response.status;
    throw error;
  }

  return data as T;
}

function formatApiError(detail: unknown) {
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item: ValidationError) => {
        const field = item.loc?.filter((part) => part !== "body").join(".");
        return field && item.msg ? `${field}: ${item.msg}` : item.msg;
      })
      .filter(Boolean)
      .join("; ") || "Request validation failed.";
  }

  return "Request failed.";
}
