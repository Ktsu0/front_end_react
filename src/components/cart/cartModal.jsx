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
    totalItensCarrinho,
    totalValorCarrinho,
    finalizarCompra,
    removerDoCarrinho,
    atualizarQuantidade,
  } = useCarrinho();

  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleToggleSelect = useCallback((item) => {
    const key = item.produtoId;
    setItensSelecionados((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const handleExcluirSelecionados = useCallback(() => {
    if (itensSelecionados.length === 0) {
      alert("Nenhum item selecionado para exclusão.");
      return;
    }

    if (
      window.confirm(
        `Tem certeza que deseja remover ${itensSelecionados.length} itens do carrinho?`,
      )
    ) {
      itensSelecionados.forEach((produtoId) => {
        removerDoCarrinho(produtoId);
      });
      setItensSelecionados([]);
    }
  }, [itensSelecionados, removerDoCarrinho]);

  const handleComprar = useCallback(async () => {
    if (carrinho.length === 0) return;
    await finalizarCompra();
  }, [carrinho, finalizarCompra]);

  const isCarrinhoVazio = carrinho.length === 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} title="Fechar">
          ✕
        </button>
        <h2>🛒 Seu Carrinho</h2>

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
              {carrinho.map((item) => {
                const key = item.produtoId;
                return (
                  <div key={key} className={styles.itemRow}>
                    <input
                      type="checkbox"
                      checked={itensSelecionados.includes(key)}
                      onChange={() => handleToggleSelect(item)}
                    />
                    <div className={styles.itemInfo}>
                      <p translate="no" className="notranslate">
                        {item.titulo}
                      </p>
                      <p className={styles.stockAlert}>
                        Disponível: {item.estoqueDisponivel}
                      </p>
                    </div>
                    <div className={styles.quantityControl}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidadeDesejada}
                        onChange={(e) =>
                          atualizarQuantidade(
                            item.produtoId,
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>

                    <span className={styles.valueCell}>
                      R$ {Number(item.valorUnitario).toFixed(2)}
                    </span>

                    <span className={styles.valueCell}>
                      R$
                      {(item.valorUnitario * item.quantidadeDesejada).toFixed(
                        2,
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

            <div className={styles.footerActions}>
              <div className={styles.totalInfo}>
                <p>Total de Itens: {totalItensCarrinho}</p>
                <h3>
                  Total a Pagar:
                  <span className={styles.totalValue}>
                    R$ {totalValorCarrinho.toFixed(2)}
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

                <button onClick={handleComprar} className={styles.checkoutBtn}>
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
