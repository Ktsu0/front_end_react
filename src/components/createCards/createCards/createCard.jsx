import styles from "./createCard.module.scss";

const CreateCard = ({
  id,
  titulo,
  descricao,
  detalhes,
  imagem,
  estoque,
  valorUnitario,
  tipo, // 💡 NOVO PROP: Recebe 'anime' ou 'serie'
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
    tipo, // 💡 INCLUSÃO: Passando o tipo para o CarrinhoProvider
  };

  const handleAddToCart = () => {
    onAddToCart(cardData, 1);
  };
  const isAvailable = estoque > 0;

  // Formata o tipo para exibição (ex: "anime" -> "Anime")
  const displayTipo = tipo
    ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
    : "Não definido";

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardFront}>
          <img src={imagem} alt={titulo} />
          <div>
            <h3>{titulo}</h3>

            {/* Renderização condicional para descrição/detalhes (inalterada) */}
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

            {/* 💡 INFORMAÇÃO DO TIPO: Adicionado para clareza (Opcional, mas útil) */}
            <p className={styles.cardType}>**Tipo:** {displayTipo}</p>

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
            className={styles.cartButton}
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
