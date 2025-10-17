import styles from "./cartButton.module.scss";

// Recebe o número total de itens e a função para abrir o modal
const CartButton = ({ itemCount, onOpen }) => {
  return (
    <button
      className={styles.cartButton}
      onClick={onOpen}
      title="Abrir Carrinho de Compras"
    >
      🛒
      {itemCount > 0 && <span className={styles.itemCount}>{itemCount}</span>}
    </button>
  );
};

export default CartButton;
