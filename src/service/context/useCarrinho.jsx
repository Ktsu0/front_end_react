import { handleApiResponse } from "./../handleProtected";

//
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Função utilitária para mapear o formato interno do carrinho (Mantida)
const mapCarrinhoToAPI = (itens) =>
  itens.map((item) => ({
    id: item.produtoId,
    quantidade: item.quantidadeDesejada,
    tipo: item.tipo,
  }));

// ----------------------------------------------------
// VALIDAR CARRINHO (Rota Protegida)
// ----------------------------------------------------

export async function validarCarrinho(carrinho) {
  const itensParaAPI = mapCarrinhoToAPI(carrinho);

  if (itensParaAPI.length === 0) {
    return null;
  }

  const res = await fetch(`${API_BASE_URL}/carrinho/validar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(itensParaAPI),
  });

  return await handleApiResponse(res);
}

// ----------------------------------------------------
// FINALIZAR COMPRA (Rota Protegida)
// ----------------------------------------------------

export async function finalizarCompra(carrinho) {
  const itensParaAPI = mapCarrinhoToAPI(carrinho);

  const res = await fetch(`${API_BASE_URL}/carrinho/comprar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(itensParaAPI),
  });

  return await handleApiResponse(res);
}
