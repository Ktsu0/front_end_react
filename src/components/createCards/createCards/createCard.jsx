import styles from "./createCard.module.scss";

const CreateCard = ({
  id,
  titulo,
  meta,
  detalhes,
  imagem,
  estoque,
  valorUnitario,
  tipo,
  onAddToCart,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const cardData = {
    id,
    titulo,
    meta,
    detalhes,
    imagem,
    estoque,
    valorUnitario,
    tipo,
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(cardData, 1);
  };

  const isAvailable = estoque > 0;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardBorder}></div>

        {!isAvailable && <div className={styles.stockBadge}>Esgotado</div>}

        <img src={imagem} alt={titulo} loading="lazy" />

        <div className={styles.infoOverlay}>
          <h3>{titulo}</h3>

          <div className={styles.metaInfo}>
            {meta?.temporada && <span>{meta.temporada}</span>}
            {meta?.tema && <span>{meta.tema}</span>}
          </div>

          <div className={styles.price}>
            <small>R$</small>{" "}
            {valorUnitario ? valorUnitario.toFixed(2) : "0.00"}
          </div>
        </div>

        <div className={styles.cardActions}>
          {isAvailable && (
            <button
              className={`${styles.actionBtn} ${styles.cart}`}
              onClick={handleAddToCart}
              title="Adicionar ao Carrinho"
            >
              🛒
            </button>
          )}

          {isAdmin && (
            <>
              <button
                className={`${styles.actionBtn} ${styles.edit}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cardData);
                }}
                title="Editar"
              >
                ✏️
              </button>
              <button
                className={`${styles.actionBtn} ${styles.delete}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                title="Excluir"
              >
                🗑️
              </button>
            </>
          )}
        </div>

        <div className={styles.sinopseBox}>
          <h4>{titulo}</h4>
          <p>{detalhes}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
