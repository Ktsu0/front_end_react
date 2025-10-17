import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:5000/series";

const useCards = () => {
  const [cards, setCards] = useState([]);

  // GET - buscar todos os cards
  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Erro ao buscar cards");
      const data = await res.json();
      setCards(data);
      return data; // Retorna os dados para ser usado em outras funções (ex: CartModal, se necessário)
    } catch (err) {
      console.error("Erro ao carregar cards:", err);
      return [];
    }
  }, []); // Sem dependências, pois só usa constantes globais

  // GET - buscar cards por termo
  const searchCards = useCallback(
    async (searchTerm) => {
      if (!searchTerm || searchTerm.trim() === "") {
        // Se a busca for vazia, busca todos os cards
        await fetchCards();
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/search?q=${searchTerm}`);
        if (!res.ok) throw new Error("Erro ao buscar cards por termo");
        const data = await res.json();

        // Atualiza o estado principal 'cards' com os resultados da busca
        setCards(data);
      } catch (err) {
        console.error("Erro ao pesquisar cards:", err);
        setCards([]); // Limpa a lista em caso de erro
      }
    },
    [fetchCards]
  ); // Depende de fetchCards

  // POST - adicionar card
  const addCard = useCallback(
    async (novoCard) => {
      try {
        const res = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoCard),
        });
        if (!res.ok) throw new Error("Erro ao adicionar card");

        // Após adicionar, recarrega a lista para garantir que o novo card apareça
        await fetchCards();
      } catch (err) {
        console.error("Erro ao adicionar card:", err);
      }
    },
    [fetchCards]
  );

  // POST - adicionar avaliação
  const addAvaliacao = useCallback(async (id, avaliacao) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/avaliacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avaliacao }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar avaliação");
      console.log(await res.text());
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
    }
  }, []);

  // PUT - editar card
  const editCard = useCallback(
    async (id, updatedCard) => {
      // Remove o ID do objeto antes de enviar, pois a rota PUT espera dados
      const { id: _, ...dataToUpdate } = updatedCard;

      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToUpdate),
        });

        if (!res.ok) throw new Error("Erro ao editar card");

        // Atualiza a lista completa para refletir a edição
        await fetchCards();
      } catch (err) {
        console.error("Erro ao editar card:", err);
      }
    },
    [fetchCards]
  );

  // DELETE - remover card
  const deleteCard = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar card");

      // Remove localmente (melhor experiência de usuário)
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erro ao deletar card:", err);
    }
  }, []);

  // Chamada inicial para carregar os cards
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    fetchCards, // Necessário para atualizar o estoque após a compra do carrinho
    searchCards,
    addCard,
    addAvaliacao,
    editCard,
    deleteCard,
  };
};

export default useCards;
