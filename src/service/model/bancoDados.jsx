import { useState, useEffect } from "react";

const useCards = () => {
  const [cards, setCards] = useState([]);

  // GET - buscar todos os cards
  const fetchCards = async () => {
    try {
      const res = await fetch("http://localhost:5000/series");
      if (!res.ok) throw new Error("Erro ao buscar cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error("Erro ao carregar cards:", err);
    }
  };

  const searchCards = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      // Se a busca for vazia, busca todos os cards e retorna
      await fetchCards();
      return; // Retorna após atualizar o estado global
    }

    try {
      const res = await fetch(
        `http://localhost:5000/series/search?q=${searchTerm}`
      );
      if (!res.ok) throw new Error("Erro ao buscar cards por termo");
      const data = await res.json();

      // 🎯 Atualiza o estado principal 'cards' com os resultados da busca
      setCards(data);
    } catch (err) {
      console.error("Erro ao pesquisar cards:", err);
      setCards([]); // Limpa a lista em caso de erro
    }
  };
  // POST - adicionar card
  const addCard = async (novoCard) => {
    try {
      const res = await fetch("http://localhost:5000/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCard),
      });
      if (!res.ok) throw new Error("Erro ao adicionar card");
      const data = await res.json();
      setCards((prev) => [...prev, data]);
    } catch (err) {
      console.error("Erro ao adicionar card:", err);
    }
  };

  // POST - adicionar avaliação
  const addAvaliacao = async (id, avaliacao) => {
    try {
      const res = await fetch(`http://localhost:5000/series/${id}/avaliacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avaliacao }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar avaliação");
      console.log(await res.text()); // resposta do backend
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
    }
  };

  // PUT - editar card
  const editCard = async (id, updatedCard) => {
    console.log("EDITANDO CARD:", updatedCard);

    const { id: _, ...dataToUpdate } = updatedCard;

    try {
      const res = await fetch(`http://localhost:5000/series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });

      if (!res.ok) throw new Error("Erro ao editar card");

      const data = await res.json();
      console.log("RESPOSTA DO BACKEND:", data);

      setCards((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...data,
                descricao: { ...c.descricao, ...data.descricao },
              }
            : c
        )
      );
    } catch (err) {
      console.error("Erro ao editar card:", err);
    }
  };

  // DELETE - remover card
  const deleteCard = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/series/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar card");
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erro ao deletar card:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    fetchCards,
    searchCards,
    addCard,
    addAvaliacao,
    editCard,
    deleteCard,
  };
};
export default useCards;
