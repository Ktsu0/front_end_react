import { setAuthToken } from "./authContext";

/**
 * Lida com a resposta de requisições protegidas, tratando erros de forma centralizada.
 * @param {Response} res - O objeto Response retornado pela função fetch.
 * @returns {Promise<any>} O corpo da resposta decodificado (JSON ou Texto).
 */
export async function handleProtectedResponse(res) {
  if (!res.ok) {
    // Tenta ler o erro do corpo da resposta (pode ser JSON ou texto)
    const errorData = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    // Trata Erros de Autenticação
    if (res.status === 401 || res.status === 403) {
      // 🔑 Executa a limpeza do token
      setAuthToken(null);
      console.error("Token expirado ou inválido. Forçando logout.");
      throw new Error("Acesso negado. Por favor, faça login novamente.");
    }

    // Lança o erro com a mensagem do backend
    throw new Error(errorData.message || "Erro desconhecido na API.");
  }

  // Sucesso: Status 204 (No Content) para DELETE, PUT, etc.
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  // Sucesso: Retorna o corpo da resposta (JSON)
  try {
    return await res.json();
  } catch (e) {
    // Caso a resposta seja um texto puro (como o token em POST/PUT/LOGIN)
    return await res.text();
  }
}
