const API_BASE_URL = "http://localhost:5000/animes";

// GET - buscar todos os cards
export async function fetchAllCards() {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error("Erro ao buscar cards");
    return await res.json();
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
    const res = await fetch(`${API_BASE_URL}/search?q=${searchTerm}`);
    if (!res.ok) throw new Error("Erro ao buscar cards por termo");
    return await res.json();
  } catch (err) {
    console.error("Erro ao pesquisar cards:", err);
    throw err;
  }
}

// POST - adicionar card
export async function addCardApi(novoCard) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoCard),
    });
    if (!res.ok) throw new Error("Erro ao adicionar card");
    return await res.json();
  } catch (err) {
    console.error("Erro ao adicionar card:", err);
    throw err;
  }
}

// PUT - editar card
export async function editCardApi(id, updatedCard) {
  const { id: _, ...dataToUpdate } = updatedCard;
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToUpdate),
    });
    if (!res.ok) throw new Error("Erro ao editar card");
    return await res.json();
  } catch (err) {
    console.error("Erro ao editar card:", err);
    throw err;
  }
}

// DELETE - remover card
export async function deleteCardApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar card");
  } catch (err) {
    console.error("Erro ao deletar card:", err);
    throw err;
  }
}

// POST - adicionar avaliação
export async function addAvaliacaoApi(id, avaliacao) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}/avaliacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avaliacao }),
    });
    if (!res.ok) throw new Error("Erro ao adicionar avaliação");
  } catch (err) {
    console.error("Erro ao enviar avaliação:", err);
    throw err;
  }
}
