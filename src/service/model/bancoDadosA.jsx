// src/services/anime.service.js

import {
  createAuthHeaders,
  handleResponse,
} from "./../context/createAuthHeaders";

const API_BASE_URL = "http://localhost:5000/animes";

// ----------------------------------------------------
// GET - Rotas PROTEGIDAS (REQUEREM TOKEN) 🔑
// ----------------------------------------------------

// GET - buscar todos os cards
export async function fetchAllCards() {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "GET",
      headers: createAuthHeaders(false), // ⬅️ Inclui o Token
    });
    return await handleResponse(res);
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
      headers: createAuthHeaders(false), // ⬅️ Inclui o Token
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao pesquisar cards:", err);
    throw err;
  }
}

// ----------------------------------------------------
// POST, PUT, DELETE (Protegidos)
// ... (O restante do arquivo permanece inalterado)
// ----------------------------------------------------

export async function addCardApi(novoCard) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: createAuthHeaders(true),
      body: JSON.stringify(novoCard),
    });
    return await handleResponse(res);
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
      headers: createAuthHeaders(true),
      body: JSON.stringify(dataToUpdate),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao editar card:", err);
    throw err;
  }
}

export async function deleteCardApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: createAuthHeaders(false),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao deletar card:", err);
    throw err;
  }
}

export async function addAvaliacaoApi(id, avaliacao) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}/avaliacao`, {
      method: "POST",
      headers: createAuthHeaders(true),
      body: JSON.stringify({ avaliacao }),
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Erro ao enviar avaliação:", err);
    throw err;
  }
}
