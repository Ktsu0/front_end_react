import React, { useState, useEffect } from "react";
import styles from "./cardsPage.module.scss";
// 1. Importações dos NOVOS componentes (o AddCard anterior deve ser excluído ou renomeado)
import AddCard from "../components/createCards/addCards/addCards";
import EditCardModal from "../components/createCards/editCards/editCards";
import CreateCard from "./../components/createCards/createCards/createCard";
import useCards from "./../service/model/bancoDados";
import FilterPanel from "../components/filterCard/filter";

const CardsPage = () => {
  const { cards, addCard, editCard, deleteCard } = useCards();
  const [editingCard, setEditingCard] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);

  // Sincroniza os cards com o estado filtrado
  useEffect(() => {
    setFilteredCards(cards);
  }, [cards]);

  // Funções de edição
  const handleEdit = (card) => setEditingCard(card);
  const handleCloseEdit = () => setEditingCard(null);
  const handleSaveEdit = (id, updatedCard) => {
    editCard(id, updatedCard);
    handleCloseEdit();
  };
  const handleDelete = (id) => deleteCard(id);
  const handleAdd = (newCardWithId) => addCard(newCardWithId);

  // NOVO: Função que aplica filtros vindos do FilterPanel
  const handleFilter = (filteredListFromPanel) => {
    setFilteredCards(filteredListFromPanel);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>Melhores Séries</header>

      {/* NOVO: Botão e painel de filtros */}
      <FilterPanel onFilter={handleFilter} />

      <main className={styles.cardsContainer}>
        {filteredCards.map((card) => (
          <CreateCard
            key={card.id}
            {...card}
            onEdit={() => handleEdit(card)}
            onDelete={handleDelete}
          />
        ))}

        <AddCard onAdd={handleAdd} />

        {editingCard && (
          <EditCardModal
            cardToEdit={editingCard}
            onEdit={handleSaveEdit}
            onClose={handleCloseEdit}
          />
        )}
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} - Desenvolvido por Gabriel Wagner |
        Contato: gabrielwag971@gmail.com
      </footer>
    </div>
  );
};

export default CardsPage;
