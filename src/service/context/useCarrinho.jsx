const BASE_URL = "http://localhost:5000";

// Função utilitária para mapear o formato interno do carrinho para o formato da API
const mapCarrinhoToAPI = (itens) =>
  itens.map((item) => ({
    id: item.produtoId,
    quantidade: item.quantidadeDesejada,
    tipo: item.tipo,
  }));

/**
 * Envia o carrinho para validação na API.
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itensParaAPI),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro ao validar o carrinho.");
  }

  return data;
}

/**
 * Finaliza a compra enviando o carrinho para a API.
 * @param {Array} carrinho - O array de itens do carrinho.
 * @returns {Promise<Object>} A resposta da compra (sucesso ou falha).
 */
export async function finalizarCompra(carrinho) {
  const itensParaAPI = mapCarrinhoToAPI(carrinho);

  const res = await fetch(`${BASE_URL}/carrinho/comprar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itensParaAPI),
  });

  const data = await res.json();

  if (!res.ok) {
    // A API pode retornar um erro HTTP ou um erro na mensagem, tratamos ambos aqui
    throw new Error(
      data.message ||
        (Array.isArray(data) ? data.join("\n") : "Erro desconhecido na compra.")
    );
  }

  return data;
}
