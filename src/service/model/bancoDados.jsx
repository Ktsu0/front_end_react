import { useState, useEffect } from "react";

export const useCards = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
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

    fetchCards();
  }, []);

  return cards;
};
