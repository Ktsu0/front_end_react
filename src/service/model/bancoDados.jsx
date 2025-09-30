import { useState, useEffect } from "react";

const useCards = () => {
  const [cards, setCards] = useState([]);

  // GET - buscar todos os cards
  const fetchCards = async () => {
    try {
      const res = await fetch("http://localhost:5000/cards");
      if (!res.ok) throw new Error("Erro ao buscar cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error("Erro ao carregar cards:", err);
    }
  };

  // POST - adicionar card
  const addCard = async (novoCard) => {
    try {
      const res = await fetch("http://localhost:5000/cards", {
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

  // PUT - editar card
  const editCard = async (id, updatedCard) => {
    // Certifique-se de que o ID não está no corpo do PUT para json-server, mas sim na URL
    const { id: _, ...dataToUpdate } = updatedCard; 

    try {
      const res = await fetch(`http://localhost:5000/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });
      if (!res.ok) throw new Error("Erro ao editar card");
      
      const data = await res.json();
      
      // O json-server não retorna o ID, então adicionamos ele de volta para a atualização do estado
      const finalCard = { ...data, id }; 
      setCards((prev) => prev.map((c) => (c.id === id ? finalCard : c)));
      
    } catch (err) {
      console.error("Erro ao editar card:", err);
    }
  };

  // DELETE - remover card
  const deleteCard = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/cards/${id}`, {
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

  return { cards, addCard, editCard, deleteCard };
};
export default useCards;
