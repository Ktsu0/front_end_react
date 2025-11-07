const API_BASE_URL = "http://localhost:5000";

// Função genérica para lidar com a resposta da API e erros
async function handleAuthResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.message || "Erro de conexão ou credenciais inválidas."
    );
  }
  return data;
}

// POST - Login de Usuário (Permanece inalterada)
export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: password }),
  });
  return handleAuthResponse(res);
}

// POST - Registro de Usuário (MODIFICADA)
export async function registerApi(userData) {
  const {
    email,
    password,
    firstName,
    lastName,
    Cpf,
    telefone,
    cep,
    genero,
    nascimento,
  } = userData;

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      Cpf,
      telefone,
      cep,
      genero,
      nascimento,
    }),
  });
  // ... (Tratamento de resposta)
  return handleAuthResponse(res);
}
