import Footer from "../footer/footer";
import Header from "../header/header";
import styles from "./animesPage.module.scss";
import { useNavigate } from "react-router-dom";
import useAnimes from "./../../hooks/hookAnimes";
import { useEffect, useState, useCallback } from "react";
import { useCarrinho } from "./../../hooks/hookCarrinho";
import CartModal from "./../../components/cart/cartModal";
import CartButton from "./../../components/cart/cartButton";
import { useAuth } from "./../../service/context/authProvider";
import FilterPanel from "./../../components/filterCard/filter";
import { useAuthError } from "./../../hooks/hookError/hookError";
import AddCard from "./../../components/createCards/addCards/addCards";
import LoadingSpinner from "./../../components/loading/loadingSpinner"; // Importando Spinner
import AuthErrorDisplay from "./../../hooks/hookError/hookErrorDisplay";
import EditCardModal from "./../../components/createCards/editCards/editCards";
import CreateCard from "./../../components/createCards/createCards/createCard";

const AnimePage = () => {
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
  } = useAnimes();

  // Lógica de Tratamento de Erro Centralizado
  const { isAuthError, handleApiError } = useAuthError();
  const [generalErrorMsg, setGeneralErrorMsg] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Hook de Carrinho (Inalterado)
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

  // Estados Locais (Inalterado)
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
        state: { from: "/animes", message: "Sessão expirada" },
      });
    }
  }, [isAuthError, navigate]);

  // Handlers (Inalterado)
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
    if (!window.confirm("Deseja realmente excluir este item?")) return;
    try {
      await deleteCard(id);
      setStatus({
        show: true,
        message: "Card removido com sucesso!",
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
      await fetchCards();
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
    // Usa o componente de UI bonito com botões
    return <AuthErrorDisplay />;
  }

  // 2. TRATAMENTO DE ERRO GERAL (Ex: Servidor Offline, Erro 500)
  if (generalErrorMsg) {
    return (
      <div className={styles.pageContainer}>
        <h1>❌ Erro ao Carregar Dados</h1>
        <p>Ocorreu um problema ao buscar os dados: {generalErrorMsg}</p>
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
      <Header></Header>
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
              <h2>Nenhum anime encontrado.</h2>
              {isAdmin ? (
                <p>Clique no botão gigante abaixo para adicionar o primeiro!</p>
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
      <Footer></Footer>
    </div>
  );
};

export default AnimePage;
