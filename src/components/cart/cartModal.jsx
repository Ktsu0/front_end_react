import { useState, useCallback } from "react";
import styles from "./cartModal.module.scss";
import { useCarrinho } from "./../../service/context/useCarrinho";

const CartModal = ({ onClose }) => {
  const {
    carrinho,
    validacao,
    loadingValidacao,
    finalizarCompraAPI,
    removerDoCarrinho,
    atualizarQuantidade,
  } = useCarrinho();

  // Guardamos a seleção como `${tipo}:${produtoId}` para evitar conflitos
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleToggleSelect = useCallback((item) => {
    const key = `${item.tipo}:${item.produtoId}`;
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
      itensSelecionados.forEach((key) => {
        const [tipo, produtoId] = key.split(":");
        removerDoCarrinho(produtoId, tipo);
      });
      setItensSelecionados([]);
    }
  }, [itensSelecionados, removerDoCarrinho]);

  const handleComprar = useCallback(async () => {
    if (!validacao || validacao.items.length === 0) return;
    await finalizarCompraAPI();
  }, [validacao, finalizarCompraAPI]);

  if (carrinho.length > 0 && loadingValidacao)
    return <div className={styles.loading}>Carregando validação...</div>;

  const isCarrinhoVazio = !validacao || validacao.items.length === 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Seu Carrinho de Compras</h2>

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
                const key = `${item.tipo}:${item.produtoId}`;
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
                            item.tipo,
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
                      onClick={() =>
                        removerDoCarrinho(item.produtoId, item.tipo)
                      }
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
