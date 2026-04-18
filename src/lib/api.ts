const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ApiError = Error & { status?: number };

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers
    : {
        "Content-Type": "application/json",
        ...options.headers,
      };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.detail ?? "Request failed.") as ApiError;
    error.status = response.status;
    throw error;
  }

  return data as T;
}
