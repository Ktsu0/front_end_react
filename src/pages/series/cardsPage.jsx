// pages/series/CardsPage.jsx
import { useState, useCallback, useEffect } from "react";
import styles from "./cardsPage.module.scss";

// Componentes da Página (Inalterados)
import AddCard from "./../../components/createCards/addCards/addCards";
import EditCardModal from "./../../components/createCards/editCards/editCards";
import CreateCard from "./../../components/createCards/createCards/createCard";
import FilterPanel from "./../../components/filterCard/filter";
import Header from "./../header/header";
import CartButton from "./../../components/cart/cartButton";
import CartModal from "./../../components/cart/cartModal";
import Footer from "./../footer/footer";

// Hooks de Dados (Inalterados)
import useCards from "../../hooks/hookSeries";
import { useCarrinho } from "./../../hooks/hookCarrinho";

// 🚨 NOVAS IMPORTAÇÕES
import { useAuthError } from "./../../hooks/hookError/hookError";
import AuthErrorDisplay from "./../../hooks/hookError/hookErrorDisplay";
import LoadingSpinner from "./../../components/loading/loadingSpinner"; // Importando Spinner
import { useNavigate } from "react-router-dom";

import { useAuth } from "./../../service/context/authProvider";

const CardsPage = () => {
  // Hooks de Dados e Erro
  const {
    cards,
    addCard,
    editCard,
    deleteCard,
    fetchCards,
    loading,
    error,
    addAvaliacao,
  } = useCards();

  // Lógica de Tratamento de Erro Centralizado
  const { isAuthError, handleApiError } = useAuthError();
  const [generalErrorMsg, setGeneralErrorMsg] = useState(null);
  const navigate = useNavigate();

  const { isAdmin } = useAuth();

  // Hook de Carrinho
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
    // 💡 IMPORTAR SETSTATUS
    setStatus,
  } = useCarrinho();

  // Estados e Handlers (Inalterados)
  const [editingCard, setEditingCard] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]); // Inicia vazio

  useEffect(() => {
    if (error) {
      const result = handleApiError(error);
      if (result) {
        setGeneralErrorMsg(result);
      }
    } else {
      setGeneralErrorMsg(null);
    }
  }, [error, handleApiError]);

  useEffect(() => {
    if (isAuthError) {
      navigate("/auth-error-page", {
        state: { from: "/series", message: "Sessão expirada" },
      });
    }
  }, [isAuthError, navigate]);

  const handleEdit = (card) => setEditingCard({ ...card });
  const handleCloseEdit = () => setEditingCard(null);

  const handleSaveEdit = async (id, updatedCard) => {
    try {
      await editCard(id, updatedCard);
      setStatus({
        show: true,
        message: "Card atualizado com sucesso!",
        type: "success",
      });
      handleCloseEdit();
    } catch (err) {
      setStatus({
        show: true,
        message: "Erro ao editar card: " + err.message,
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta série?")) return;
    try {
      await deleteCard(id);
      setStatus({
        show: true,
        message: "Série removida com sucesso!",
        type: "success",
      });
    } catch (err) {
      setStatus({
        show: true,
        message: "Erro ao excluir card: " + err.message,
        type: "error",
      });
    }
  };

  const handleRate = async (id, avaliacao) => {
    try {
      await addAvaliacao(id, avaliacao);
      await fetchCards(); // Recarrega para mostrar a nova média
      setStatus({
        show: true,
        message: "Obrigado por avaliar!",
        type: "success",
      });
    } catch (err) {
      setStatus({
        show: true,
        message: "Erro ao avaliar: " + err.message,
        type: "error",
      });
    }
  };

  const handleAdd = async (newCardWithId) => {
    try {
      await addCard(newCardWithId);
    } catch (err) {
      setStatus({
        show: true,
        message: "Erro ao adicionar card: " + err.message,
        type: "error",
      });
    }
  };

  const handleFilter = useCallback((filteredListFromPanel) => {
    setFilteredCards(filteredListFromPanel);
  }, []);

  // ----------------------------------------------------
  // 🚨 LÓGICA DE RENDERIZAÇÃO CONDICIONAL (PRIORIDADE)
  // ----------------------------------------------------

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  // 1. TRATAMENTO DO ERRO DE AUTENTICAÇÃO (Máxima Prioridade)
  if (isAuthError) {
    return <AuthErrorDisplay />;
  }

  // 2. TRATAMENTO DE ERRO GERAL (Server Offline, 404, etc.)
  if (generalErrorMsg) {
    return (
      <div className={styles.pageContainer}>
        <h1>❌ Erro ao Carregar Dados</h1>
        <p>Ocorreu um problema: {generalErrorMsg}</p>
        <button
          onClick={fetchCards}
          style={{ padding: "10px 15px", marginTop: "10px" }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <FilterPanel cards={cards} onFilter={handleFilter} />

      <main className={styles.cardsContainer}>
        {filteredCards.length > 0 ? (
          <>
            {filteredCards.map((card) => (
              <CreateCard
                key={card.id}
                {...card}
                estoque={card.estoque}
                valorUnitario={card.valorUnitario}
                onAddToCart={adicionarAoCarrinho}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRate={handleRate}
                isAdmin={isAdmin}
              />
            ))}
            {isAdmin && <AddCard onAdd={handleAdd} />}
          </>
        ) : (
          <div className={styles.noCardsContainer}>
            <div className={styles.noCardsMessage}>
              <h2>Nenhuma série encontrada.</h2>
              {isAdmin ? (
                <p>Clique no botão gigante abaixo para adicionar a primeira!</p>
              ) : (
                <p>Volte mais tarde ou tente outros filtros.</p>
              )}
            </div>
            {isAdmin && (
              <div className={styles.centeredAdd}>
                <AddCard onAdd={handleAdd} />
              </div>
            )}
          </div>
        )}

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

      <Footer />
    </div>
  );
};

export default CardsPage;
