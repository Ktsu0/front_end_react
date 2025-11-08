import { getAuthToken, setAuthToken } from "./authContext";

/**
 * Monta os cabeçalhos da requisição, incluindo o token JWT.
 * @param {boolean} hasBody - Adiciona 'Content-Type: application/json' se true.
 */

function createAuthHeaders(hasBody = false) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Sessão expirada. Autenticação é necessária.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Processa a resposta da API (sucesso, 204, erros) de forma centralizada.
 * @param {Response} res - Objeto Response do fetch.
 */
async function handleResponse(res) {
  // ⬅️ Definido com export
  if (!res.ok) {
    // Tenta ler o corpo para obter a mensagem de erro
    const errorData = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    // 💡 TRATAMENTO DE ERRO DE AUTENTICAÇÃO (Melhoria de Segurança)
    if (res.status === 401 || res.status === 403) {
      setAuthToken(null); // Limpa o token expirado/inválido
      throw new Error("Sessão inválida. Faça login novamente.");
    }
    // Erros gerais (400, 500, etc.)
    throw new Error(errorData.message || "Erro na requisição.");
  }
  // Resposta 204 (No Content - comum em DELETE/PUT)
  if (res.status === 204) {
    return null;
  }
  // Tenta retornar JSON, se falhar, retorna o texto puro (como o token)
  return res.json().catch(() => res.text());
}

export { handleResponse, createAuthHeaders };

//
