const API_BASE_URL = "http://localhost:5000";

// Função genérica para lidar com a resposta da API e erros
async function handleAuthResponse(res) {
  // Se a resposta for um erro (res.ok é false)
  if (!res.ok) {
    // Tentamos ler o corpo para obter a mensagem de erro da API
    const errorData = await res.json();
    throw new Error(
      errorData.message ||
        errorData.error ||
        "Erro de conexão ou credenciais inválidas."
    );
  }
  try {
    return await res.json();
  } catch (e) {
    return { success: true };
  }
}

// ------------------------------------------------------------------
// POST - Login de Usuário: Recebe Token e Salva
// ------------------------------------------------------------------
export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: password }),
  });

  return handleAuthResponse(res);
}

// ------------------------------------------------------------------
// POST - Registro de Usuário: Recebe Token e Salva
// ------------------------------------------------------------------
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

  return handleAuthResponse(res);
}
