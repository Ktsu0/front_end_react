import { useState, useCallback } from "react";
import styles from "./cardsPage.module.scss";
// 1. Importações dos NOVOS componentes (o AddCard anterior deve ser excluído ou renomeado)
import AddCard from "../components/createCards/addCards/addCards";
import EditCardModal from "../components/createCards/editCards/editCards";
import CreateCard from "./../components/createCards/createCards/createCard";
import useCards from "./../service/model/bancoDados";
import FilterPanel from "../components/filterCard/filter";
import Header from "./header/header";
import { useCarrinho } from "../service/context/useCarrinho";
import CartButton from "../components/cart/cartButton";
import CartModal from "../components/cart/cartModal";

const CardsPage = () => {
  const { cards, addCard, editCard, deleteCard, fetchCards } = useCards();
  const {
    carrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    totalItensCarrinho,
    modalAberto,
    abrirModal,
    fecharModal,
  } = useCarrinho();
  const [editingCard, setEditingCard] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);

  useState(() => {
    if (cards.length > 0) {
      setFilteredCards(cards);
    }
  }, [cards]);

  // Funções de edição
  const handleEdit = (card) => setEditingCard({ ...card });
  const handleCloseEdit = () => setEditingCard(null);
  const handleSaveEdit = async (id, updatedCard) => {
    await editCard(id, updatedCard);
    handleCloseEdit();
    setFilteredCards(cards);
  };
  const handleDelete = (id) => deleteCard(id);
  const handleAdd = (newCardWithId) => addCard(newCardWithId);

  const handleFilter = useCallback((filteredListFromPanel) => {
    setFilteredCards(filteredListFromPanel);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <FilterPanel cards={cards} onFilter={handleFilter} />

      <main className={styles.cardsContainer}>
        {filteredCards.map((card) => (
          <CreateCard
            key={card.id}
            {...card}
            estoque={card.estoque}
            valorUnitario={card.valorUnitario}
            onAddToCart={adicionarAoCarrinho}
            onEdit={handleEdit}
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
      <CartButton itemCount={totalItensCarrinho} onOpen={abrirModal} />
      {modalAberto && (
        <CartModal
          carrinho={carrinho}
          onClose={fecharModal}
          removerDoCarrinho={removerDoCarrinho}
          atualizarQuantidade={atualizarQuantidade}
          limparCarrinho={limparCarrinho}
          fetchCards={fetchCards}
        />
      )}

      <footer className={styles.footer}>
        © {new Date().getFullYear()} - Desenvolvido por Gabriel Wagner |
        Contato: gabrielwag971@gmail.com
      </footer>
    </div>
  );
};

export default CardsPage;
