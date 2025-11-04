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
export async function loginApi(email, senha) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha }),
  });
  return handleAuthResponse(res);
}

// POST - Registro de Usuário (MODIFICADA)
export async function registerApi(userData) {
  const {
    email,
    senha,
    firstName,
    lastName,
    Cpf,
    telefone,
    cep,
    genero,
    nascimento,
  } = userData;

  // Log de diagnóstico
  console.log("Payload FINAL para API:", userData);

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password: senha,
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
