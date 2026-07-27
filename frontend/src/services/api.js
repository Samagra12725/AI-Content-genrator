const API_BASE_URL = "http://localhost:5001/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const api = {
  // Auth API
  register: async (name, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const parsed = await handleResponse(res);
    if (parsed.success && parsed.data.token) {
      localStorage.setItem("token", parsed.data.token);
      localStorage.setItem("user", JSON.stringify({ name: parsed.data.name, email: parsed.data.email }));
    }
    return parsed;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const parsed = await handleResponse(res);
    if (parsed.success && parsed.data.token) {
      localStorage.setItem("token", parsed.data.token);
      localStorage.setItem("user", JSON.stringify({ name: parsed.data.name, email: parsed.data.email }));
    }
    return parsed;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Product Content API
  generateContent: async (productData) => {
    const res = await fetch(`${API_BASE_URL}/products/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await handleResponse(res);
  },

  getHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/products/history`, {
      method: "GET",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },

  deleteContent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await handleResponse(res);
  },
};
