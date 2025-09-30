import React, { useState } from "react";
import styles from "./cardsPage.module.scss";
// 1. Importações dos NOVOS componentes (o AddCard anterior deve ser excluído ou renomeado)
import AddCard from "../components/createCards/addCards/addCards";
import EditCardModal from "../components/createCards/editCards/editCards";
import CreateCard from './../components/createCards/createCards/createCard';
import useCards from './../service/model/bancoDados';

const CardsPage = () => {
  const { cards, addCard, editCard, deleteCard } = useCards();
  const [editingCard, setEditingCard] = useState(null); // Contém o card sendo editado

  const handleEdit = (card) => {
    // 2. Inicia o modal de edição ao definir o card no estado
    setEditingCard(card);
  };
  
  // Função para fechar o modal de edição
  const handleCloseEdit = () => {
    setEditingCard(null);
  };

  const handleDelete = (id) => {
    console.log(`Tentativa de deletar card com ID: ${id}`);
    deleteCard(id);
  };

  // Função para salvar a EDIÇÃO (PUT)
  const handleSaveEdit = (id, updatedCard) => {
    // 3. Esta função é chamada pelo EditCardModal e executa o PUT
    console.log(`Salvando EDICAO para o ID: ${id}`);
    editCard(id, updatedCard);
    handleCloseEdit();
  };

  // Função para salvar NOVO CARD (POST)
  const handleAdd = (newCardWithId) => {
    // Esta função é chamada pelo AddCardButton e executa o POST
    console.log(`Salvando NOVO card com ID: ${newCardWithId.id}`);
    addCard(newCardWithId);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>Melhores Séries</header>

      <main className={styles.cardsContainer}>
        {cards.map((card) => (
          <CreateCard
            key={card.id}
            {...card}
            onEdit={() => handleEdit(card)} 
            onDelete={handleDelete}
          />
        ))}
        <AddCard onAdd={handleAdd} />
        
        {/* 5. Modal de Edição (Aparece APENAS quando há um card selecionado) */}
        {editingCard && (
          <EditCardModal
            cardToEdit={editingCard}
            onEdit={handleSaveEdit} // Passa a função que executa o PUT
            onClose={handleCloseEdit} // Passa a função para fechar o modal
          />
        )}
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} - Desenvolvido por Gabriel Wagner | Contato: gabrielwag971@gmail.com
      </footer>
    </div>
  );
};

export default CardsPage;
