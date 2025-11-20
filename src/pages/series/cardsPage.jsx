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

// 🚨 NOVAS IMPORTAÇÕES PARA TRATAMENTO DE ERRO DE AUTENTICAÇÃO
import { useAuthError } from "./../../hooks/hookError/hookError";
import AuthErrorDisplay from "./../../hooks/hookError/hookErrorDisplay";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./../../service/context/authProvider";

const CardsPage = () => {
  // Hooks de Dados e Erro
  const { cards, addCard, editCard, deleteCard, fetchCards, loading, error } =
    useCards("series"); // Assumindo que useCards é seu hook de Séries

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
  } = useCarrinho();

  // Estados e Handlers (Inalterados)
  const [editingCard, setEditingCard] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);

  // 🚨 NOVO useEffect: Processa o 'error' vindo de useCards
  useEffect(() => {
    if (error) {
      // Verifica se é um erro de Auth ou um erro Geral
      const result = handleApiError(error);
      if (result) {
        // Se result não for null, é um erro geral (servidor, 404, etc.)
        setGeneralErrorMsg(result);
      }
    } else {
      // Limpa o erro geral se o 'error' de useCards sumir
      setGeneralErrorMsg(null);
    }
  }, [error, handleApiError]);

  useEffect(() => {
    if (isAuthError) {
      // Se o erro de Auth for detectado, redireciona para a tela de login.
      // Você pode passar um estado ou parâmetro para mostrar a mensagem de erro.
      navigate("/auth-error-page", {
        state: { from: "/animes", message: "Sessão expirada" },
      });
    }
  }, [isAuthError, navigate]);
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

  // ----------------------------------------------------
  // 🚨 LÓGICA DE RENDERIZAÇÃO CONDICIONAL (PRIORIDADE)
  // ----------------------------------------------------

  if (loading) {
    return <div className={styles.pageContainer}>Carregando Séries...</div>;
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

  // ----------------------------------------------------
  // RENDERIZAÇÃO NORMAL
  // ----------------------------------------------------

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
            isAdmin={isAdmin}
          />
        ))}

        {isAdmin && <AddCard onAdd={handleAdd} />}

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
