const BASE_URL = ((import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000") as string).replace(/\/$/, "");

const getToken = async () => {
  try {
    const clerk = (window as any).Clerk;
    if (clerk && clerk.session) {
      return await clerk.session.getToken();
    }
  } catch (e) {
    console.error("Failed to get clerk token", e);
  }
  return null;
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "omit", // Clerk handles auth via Bearer token now
      headers,
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
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to STOCKSEE servers. Please check your internet connection.");
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
  getBaseUrl: () => BASE_URL,
};
