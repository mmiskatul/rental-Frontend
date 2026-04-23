const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ApiError = Error & { status?: number };

type ValidationError = {
  loc?: Array<string | number>;
  msg?: string;
};

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
