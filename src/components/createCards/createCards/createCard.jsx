import styles from "./createCard.module.scss";

const CreateCard = ({
  id,
  titulo,
  descricao,
  detalhes,
  imagem,
  estoque,
  valorUnitario,
  onAddToCart,

  onEdit,
  onDelete,
}) => {
  const cardData = {
    id,
    titulo,
    descricao,
    detalhes,
    imagem,
    estoque,
    valorUnitario,
  };

  const handleAddToCart = () => {
    onAddToCart(cardData, 1);
  };
  const isAvailable = estoque > 0;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardFront}>
          <img src={imagem} alt={titulo} />
          <div>
            <h3>{titulo}</h3>

            {descricao && typeof descricao === "object" ? (
              <div
                className={styles.row}
                key={`${descricao.tema}-${descricao.temporada}-${id}`}
              >
                <p>
                  <strong>Temporada:</strong>
                  <br /> {descricao.temporada}
                </p>
                <p>
                  <strong>Tema:</strong>
                  <br /> {descricao.tema}
                </p>
              </div>
            ) : (
              <p>{descricao}</p>
            )}

            <div className={styles.commerceInfo}>
              <p className={styles.price}>
                <strong>Preço:</strong> R${" "}
                {valorUnitario ? valorUnitario.toFixed(2) : "N/A"}
              </p>
              <p
                className={`${styles.stock} ${
                  isAvailable ? styles.inStock : styles.outOfStock
                }`}
              >
                <strong>Estoque:</strong> {isAvailable ? estoque : "ESGOTADO"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.cardBack}>
          <h4>{titulo}</h4>
          <p>{detalhes}</p>
        </div>
      </div>

      <div className={styles.cardActions}>
        {isAvailable && (
          <span
            className={styles.cartIcon}
            onClick={handleAddToCart}
            title="Adicionar ao Carrinho"
          >
            🛒
          </span>
        )}

        <span
          className={styles.editIcon}
          onClick={() => onEdit(cardData)}
          title="Editar Card"
        >
          ✏️
        </span>
        <span
          className={styles.deleteIcon}
          onClick={() => onDelete(id)}
          title="Deletar Card"
        >
          🗑️
        </span>
      </div>
    </div>
  );
};

export default CreateCard;
