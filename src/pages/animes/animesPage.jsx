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
import AuthErrorDisplay from "./../../hooks/hookError/hookErrorDisplay";
import EditCardModal from "./../../components/createCards/editCards/editCards";
import CreateCard from "./../../components/createCards/createCards/createCard";

const AnimePage = () => {
  // Hooks de Dados e Erro
  const { cards, addCard, editCard, deleteCard, fetchCards, loading, error } =
    useAnimes();

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
  } = useCarrinho();

  // Estados Locais (Inalterado)
  const [editingCard, setEditingCard] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);

  // 🚨 NOVO useEffect: Processa o 'error' vindo de useAnimes
  useEffect(() => {
    if (error) {
      const result = handleApiError(error);
      if (result) {
        setGeneralErrorMsg(result);
      }
    } else {
      // Limpa o erro geral se o 'error' do useAnimes sumir
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

  // useEffect para Filtragem (Inalterado)
  useEffect(() => {
    if (cards.length > 0) {
      setFilteredCards(cards);
    }
  }, [cards]);

  // Handlers (Inalterado)
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
    return <div className={styles.pageContainer}>Carregando Animes...</div>;
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

  // ----------------------------------------------------
  // RENDERIZAÇÃO NORMAL (Inalterada)
  // ----------------------------------------------------

  return (
    <div className={styles.pageContainer}>
      <Header></Header>
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
      <Footer></Footer>
    </div>
  );
};

export default AnimePage;
