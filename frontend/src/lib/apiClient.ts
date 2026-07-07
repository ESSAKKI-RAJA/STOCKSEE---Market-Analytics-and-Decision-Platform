const BASE_URL = ((import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000") as string).replace(/\/$/, "");

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = localStorage.getItem("access_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: please log in");
  }
  if (res.status === 403) {
    throw new Error("Forbidden: insufficient permissions");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
  getBaseUrl: () => BASE_URL,
};
