// service/authService.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// -------------------------------
// Tratamento de resposta da API
// -------------------------------
async function handleAuthResponse(res) {
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || data.error || "Erro de autenticação.");
  }

  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

// -------------------------------
// GET → Roles do usuário (cookie)
// -------------------------------
export async function getUserRole() {
  const res = await fetch(`${API_BASE_URL}/users/role`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.roles;
}

// -------------------------------
// POST → Login
// -------------------------------
export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return handleAuthResponse(res);
}

// -------------------------------
// POST → Registro
// -------------------------------
export async function registerApi(userData) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  return handleAuthResponse(res);
}

// -------------------------------
// POST → Logout
// -------------------------------
export async function logoutApi() {
  await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}
