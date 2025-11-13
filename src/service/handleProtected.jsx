/**
 * Lida com a resposta de requisições protegidas, tratando erros 401/403
 * e retornando o corpo da resposta em caso de sucesso.
 * @param {Response} res - O objeto Response retornado pela função fetch.
 * @returns {Promise<any>} O corpo da resposta decodificado (JSON) ou null.
 */
export async function handleApiResponse(res) {
  if (!res.ok) {
    // Tenta ler o erro do corpo
    const errorData = await res
      .json()
      .catch(() => ({ message: res.statusText }));

    // Tratamento de Erro de Autenticação (Cookie inválido/expirado)
    if (res.status === 401 || res.status === 403) {
      console.error("Sessão inválida. O cookie não foi aceito pelo servidor.");
      // Lança um erro customizado para ser tratado no AuthContext/Hook
      const authError = new Error(
        "Acesso negado. Por favor, faça login novamente."
      );
      authError.statusCode = res.status;
      throw authError;
    }

    // Erros gerais (400, 500, etc.)
    throw new Error(errorData.message || "Erro desconhecido na API.");
  }

  // Sucesso: Status 204 (No Content)
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  // Sucesso: Retorna JSON
  try {
    return await res.json();
  } catch (e) {
    // Caso não haja JSON (muito raro em sucesso 200/201), retorna sucesso genérico
    return { success: true };
  }
}
