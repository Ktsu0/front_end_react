const API_BASE_URL = "http://localhost:5000";

// Função genérica para lidar com a resposta da API e erros
async function handleAuthResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    // Lança um erro com a mensagem da API para ser capturado no Contexto/Hook
    throw new Error(
      data.message || "Erro de conexão ou credenciais inválidas."
    );
  }
  return data; // Retorna os dados do usuário/token
}

// POST - Login de Usuário
export async function loginApi(email, senha) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha }),
  });
  return handleAuthResponse(res);
}

// POST - Registro de Usuário
export async function registerApi(email, senha, firstName, lastName) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha, firstName, lastName }),
  });
  return handleAuthResponse(res);
}
