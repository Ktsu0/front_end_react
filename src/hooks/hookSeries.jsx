import { useState, useEffect, useCallback } from "react";

import {
  fetchAllCards,
  searchCardsApi,
  addCardApi,
  editCardApi,
  deleteCardApi,
  addAvaliacaoApi,
} from "./../service/model/bancoDados";

const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função central para buscar (chamando a API pura)
  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllCards();
      setCards(data || []);
    } catch (err) {
      setError(err.message);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCards = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchCardsApi(searchTerm);
      setCards(data);
    } catch (err) {
      setError(err.message);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCard = useCallback(
    async (novoCard) => {
      try {
        await addCardApi(novoCard);
        await fetchCards();
      } catch (err) {
        setError(err.message);
      }
    },
    [fetchCards],
  );

  const editCard = useCallback(
    async (id, updatedCard) => {
      try {
        await editCardApi(id, updatedCard);
        await fetchCards();
      } catch (err) {
        setError(err.message);
      }
    },
    [fetchCards],
  );

  const deleteCard = useCallback(async (id) => {
    try {
      await deleteCardApi(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    loading,
    error,
    fetchCards,
    searchCards,
    addCard,
    editCard,
    deleteCard,
    addAvaliacao: addAvaliacaoApi,
  };
};

export default useCards;
