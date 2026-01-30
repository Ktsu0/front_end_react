import { handleApiResponse } from "./../handleProtected";

const API_BASE_URL = process.env.REACT_APP_API_URL_ANIMES;

// ----------------------------------------------------
// GET - Rotas PROTEGIDAS (REQUEREM COOKIE) 🔑
// ----------------------------------------------------

// GET - buscar todos os cards
export async function fetchAllCards() {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {},
      credentials: "include",
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao carregar cards:", err);
    throw err;
  }
}

// GET - buscar cards por termo
export async function searchCardsApi(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return fetchAllCards();
  }
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${searchTerm}`, {
      method: "GET",
      headers: {},
      credentials: "include",
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao pesquisar cards:", err);
    throw err;
  }
}

// ----------------------------------------------------
// POST, PUT, DELETE (Protegidos)
// ----------------------------------------------------

export async function addCardApi(novoCard) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(novoCard),
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao adicionar card:", err);
    throw err;
  }
}

export async function editCardApi(id, updatedCard) {
  const { id: _, ...dataToUpdate } = updatedCard;
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToUpdate),
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao editar card:", err);
    throw err;
  }
}

export async function deleteCardApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {},
      credentials: "include",
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao deletar card:", err);
    throw err;
  }
}

export async function addAvaliacaoApi(id, avaliacao) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}/avaliacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ avaliacao }),
    });
    return await handleApiResponse(res);
  } catch (err) {
    console.error("Erro ao enviar avaliação:", err);
    throw err;
  }
}
