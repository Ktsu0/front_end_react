import styles from "./animesPage.module.scss";
import Footer from "../footer/footer";
import Header from "../header/header";
import { useEffect, useState, useCallback } from "react";
import AddCard from "./../../components/createCards/addCards/addCards";
import EditCardModal from "./../../components/createCards/editCards/editCards";
import CreateCard from "./../../components/createCards/createCards/createCard";
import FilterPanel from "./../../components/filterCard/filter";
import { useCarrinho } from "./../../service/context/useCarrinho";
import CartButton from "./../../components/cart/cartButton";
import CartModal from "./../../components/cart/cartModal";
import useAnimes from "./../../hooks/hookAnimes";

const AnimePage = () => {
  const { cards, addCard, editCard, deleteCard, fetchCards, loading, error } =
    useAnimes();
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

  useEffect(() => {
    if (cards.length > 0) {
      setFilteredCards(cards);
    }
  }, [cards]);

  const handleEdit = (card) => setEditingCard({ ...card });
  const handleCloseEdit = () => setEditingCard(null);

  const handleSaveEdit = async (id, updatedCard) => {
    await editCard(id, updatedCard);
    handleCloseEdit();
  };

  const handleDelete = (id) => deleteCard(id);
  const handleAdd = (newCardWithId) => addCard(newCardWithId);

  const handleFilter = useCallback((filteredListFromPanel) => {
    setFilteredCards(filteredListFromPanel);
  }, []);
  if (loading) {
    return <div className={styles.pageContainer}>Carregando Séries...</div>;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        Erro ao carregar dados: {error}
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header></Header>
      <FilterPanel cards={cards} onFilter={handleFilter} />{" "}
      <main className={styles.cardsContainer}>
        {" "}
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
        <AddCard onAdd={handleAdd} />{" "}
        {editingCard && (
          <EditCardModal
            cardToEdit={editingCard}
            onEdit={handleSaveEdit}
            onClose={handleCloseEdit}
          />
        )}{" "}
      </main>
      <CartButton itemCount={totalItensCarrinho} onOpen={abrirModal} />{" "}
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
      <Footer></Footer>{" "}
    </div>
  );
};

export default AnimePage;
