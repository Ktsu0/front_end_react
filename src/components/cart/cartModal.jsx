import { useState, useCallback } from "react";
import styles from "./cartModal.module.scss";

import { useCarrinho } from "./../../service/context/useCarrinho";

const CartModal = ({ onClose, removerDoCarrinho, atualizarQuantidade }) => {
  const { carrinho, validacao, loadingValidacao, finalizarCompraAPI } =
    useCarrinho();

  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleToggleSelect = useCallback((serieId) => {
    setItensSelecionados((prev) =>
      prev.includes(serieId)
        ? prev.filter((id) => id !== serieId)
        : [...prev, serieId]
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
      itensSelecionados.forEach((id) => removerDoCarrinho(id));
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
        <h2>Seu Carrinho de Compras (Shopee Style)</h2>

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
              {validacao.items.map((item) => (
                <div key={item.serieId} className={styles.itemRow}>
                  <input
                    type="checkbox"
                    checked={itensSelecionados.includes(item.serieId)}
                    onChange={() => handleToggleSelect(item.serieId)}
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
                          item.serieId,
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
                    {(item.valorUnitario * item.quantidadeDesejada).toFixed(2)}
                  </span>

                  <button
                    className={styles.deleteItemButton}
                    onClick={() => removerDoCarrinho(item.serieId)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
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
