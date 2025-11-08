import { createAuthHeaders } from "./createAuthHeaders"; // ⬅️ Importando a função centralizada
// ⚠️ É crucial importar também a função que lida com a resposta
import { handleProtectedResponse } from "./protectedResponse"; // ⬅️ Assumindo que este é o utilitário para respostas

const BASE_URL = "http://localhost:5000";

// Função utilitária para mapear o formato interno do carrinho para o formato da API (Mantida)
const mapCarrinhoToAPI = (itens) =>
  itens.map((item) => ({
    id: item.produtoId,
    quantidade: item.quantidadeDesejada,
    tipo: item.tipo,
  }));

// ----------------------------------------------------
// VALIDAR CARRINHO (Rota Protegida) - REUTILIZANDO
// ----------------------------------------------------

/**
 * Envia o carrinho para validação na API, incluindo o token JWT.
 * @param {Array} carrinho - O array de itens do carrinho.
 * @returns {Promise<Object>} Os dados de validação da API.
 */
export async function validarCarrinho(carrinho) {
  const itensParaAPI = mapCarrinhoToAPI(carrinho);

  if (itensParaAPI.length === 0) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/carrinho/validar`, {
    method: "POST",
    headers: createAuthHeaders(true), // ⬅️ Usando a função IMPORTADA. 'true' indica corpo JSON.
    body: JSON.stringify(itensParaAPI),
  });

  const data = await handleProtectedResponse(res);
  return data;
}

// ----------------------------------------------------
// FINALIZAR COMPRA (Rota Protegida) - REUTILIZANDO
// ----------------------------------------------------

/**
 * Finaliza a compra enviando o carrinho para a API, incluindo o token JWT.
 * @param {Array} carrinho - O array de itens do carrinho.
 * @returns {Promise<Object>} A resposta da compra (sucesso ou falha).
 */
export async function finalizarCompra(carrinho) {
  const itensParaAPI = mapCarrinhoToAPI(carrinho);

  const res = await fetch(`${BASE_URL}/carrinho/comprar`, {
    method: "POST",
    headers: createAuthHeaders(true), // ⬅️ Usando a função IMPORTADA. 'true' indica corpo JSON.
    body: JSON.stringify(itensParaAPI),
  });

  const data = await handleProtectedResponse(res);
  return data;
}
