import { useState, useCallback, useEffect } from "react";
import styles from "./cartModal.module.scss";
import { useCarrinho } from "./../../hooks/hookCarrinho";

// 🚨 IMPORTAÇÕES PARA TRATAMENTO DE ERRO DE AUTENTICAÇÃO
import { useAuthError } from "./../../hooks/hookError/hookError";
// Importar o AuthErrorDisplay é opcional aqui, mas mantemos o hook de erro.
import { useNavigate } from "react-router-dom";

const CartModal = ({ onClose, fetchCards }) => {
  // Hooks de Dados e Erro do Carrinho
  const {
    carrinho,
    validacao,
    loadingValidacao,
    finalizarCompra,
    removerDoCarrinho,
    atualizarQuantidade,
    // 🔑 Assumindo que useCarrinho expõe o erro do carrinho
    cartError,
  } = useCarrinho();

  // Lógica de Tratamento de Erro Centralizado
  const { isAuthError, handleApiError } = useAuthError();
  const [generalErrorMsg, setGeneralErrorMsg] = useState(null);
  const navigate = useNavigate();

  // 🚨 useEffect para processar o erro vindo do useCarrinho
  useEffect(() => {
    if (cartError) {
      // Verifica se é um erro de Auth ou um erro Geral
      const result = handleApiError(cartError);

      if (isAuthError) {
        // Se for erro de autenticação, fecha o modal imediatamente.
        // A página de fundo (AnimePage/CardsPage) pegará o erro na próxima renderização.
        onClose();
        return;
      }

      if (result) {
        // Se result não for null, é um erro geral.
        setGeneralErrorMsg(result);
      }
    } else {
      setGeneralErrorMsg(null);
    }
  }, [cartError, handleApiError, isAuthError, onClose]);

  useEffect(() => {
    if (isAuthError) {
      // Limpa o erro geral, se houver
      setGeneralErrorMsg(null);

      // Redireciona para a rota onde o AuthErrorDisplay está montado
      navigate("/login", { state: { sessionExpired: true } });
      // OBS: Se você já usa o AuthErrorDisplay diretamente, você pode apontar para onde ele está.

      // Ou, se AuthErrorDisplay é o que você quer mostrar em tela cheia na URL atual:
      // Não faça o navigate, mas garanta que o if(isAuthError) abaixo funcione.
    }
  }, [isAuthError, navigate]);

  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleToggleSelect = useCallback((item) => {
    const key = item.produtoId;
    setItensSelecionados((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleExcluirSelecionados = useCallback(() => {
    if (itensSelecionados.length === 0) {
      alert("Nenhum item selecionado para exclusão.");
      return;
    }

    if (
      window.confirm(
        `Tem certeza que deseja remover ${itensSelecionados.length} itens do carrinho?`
      )
    ) {
      itensSelecionados.forEach((produtoId) => {
        removerDoCarrinho(produtoId);
      });
      setItensSelecionados([]);
    }
  }, [itensSelecionados, removerDoCarrinho]);

  const handleComprar = useCallback(async () => {
    if (!validacao || validacao.items.length === 0) return;

    const compraSucesso = await finalizarCompra();

    if (compraSucesso) {
      alert("Compra finalizada com sucesso!");
      onClose();
      // 💡 Se a compra alterar o estoque, o fetchCards da página principal deve ser chamado
      if (fetchCards) {
        fetchCards();
      }
    }
  }, [validacao, finalizarCompra, onClose, fetchCards]);

  if (carrinho.length > 0 && loadingValidacao)
    return <div className={styles.loading}>Carregando validação...</div>;

  // 🚨 Se isAuthError for true, o modal já se fechou no useEffect. Retornamos null.
  if (isAuthError) return null;

  const isCarrinhoVazio = !validacao || validacao.items.length === 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Seu Carrinho de Compras</h2>

        {/* 🚨 Exibir erro geral, se houver */}
        {generalErrorMsg && (
          <div className={styles.errorBox}>
            <h4>❌ Erro no Carrinho:</h4>
            <p>{generalErrorMsg}</p>
          </div>
        )}

        {!isCarrinhoVazio ? (
          <>
            <div className={styles.headerRow}>
              <span></span>
              <span className={styles.itemHeader}>Item</span>
              <span className={styles.quantityHeader}>Qtd.</span>
              <span className={styles.valueHeader}>Preço Unitário</span>
              <span className={styles.valueHeader}>Subtotal</span>
              <span></span>
            </div>

            <div className={styles.itemList}>
              {validacao.items.map((item) => {
                const key = item.produtoId;
                return (
                  <div key={key} className={styles.itemRow}>
                    <input
                      type="checkbox"
                      checked={itensSelecionados.includes(key)}
                      onChange={() => handleToggleSelect(item)}
                    />
                    <div className={styles.itemInfo}>
                      <p>{item.titulo}</p>
                      <p className={styles.stockAlert}>
                        Estoque: {item.estoqueDisponivel}
                      </p>
                    </div>
                    <div className={styles.quantityControl}>
                      <input
                        type="number"
                        min="1"
                        max={item.estoqueDisponivel}
                        value={item.quantidadeDesejada}
                        onChange={(e) =>
                          atualizarQuantidade(
                            item.produtoId,
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <span className={styles.valueCell}>
                      R$ {item.valorUnitario.toFixed(2)}
                    </span>

                    <span className={styles.valueCell}>
                      R$
                      {(item.valorUnitario * item.quantidadeDesejada).toFixed(
                        2
                      )}
                    </span>

                    <button
                      className={styles.deleteItemButton}
                      onClick={() => removerDoCarrinho(item.produtoId)}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            {validacao.validacao.erros.length > 0 && (
              <div className={styles.errorBox}>
                <h4>❌ Problemas no Carrinho:</h4>
                <ul>
                  {validacao.validacao.erros.map((erro, i) => (
                    <li key={i}>{erro}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.footerActions}>
              <div className={styles.totalInfo}>
                <p>Total de Itens: {validacao.validacao.totalItens}</p>
                <h3>
                  Total a Pagar:
                  <span className={styles.totalValue}>
                    R$ {validacao.validacao.valorTotal.toFixed(2)}
                  </span>
                </h3>
              </div>

              <div className={styles.actionButtons}>
                <button
                  onClick={handleExcluirSelecionados}
                  className={styles.deleteSelectedBtn}
                >
                  Excluir Selecionados ({itensSelecionados.length})
                </button>

                <button
                  onClick={handleComprar}
                  className={styles.checkoutBtn}
                  disabled={validacao.validacao.erros.length > 0}
                >
                  Comprar Agora
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyCart}>
            Seu carrinho está vazio. Adicione cards para comprar!
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
