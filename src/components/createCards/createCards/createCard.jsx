import styles from "./createCard.module.scss";

const CreateCard = ({
  id,
  titulo,
  descricao,
  detalhes,
  imagem,
  onEdit,
  onDelete,
}) => {
  const cardData = { id, titulo, descricao, detalhes, imagem };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardFront}>
          <img src={imagem} alt={titulo} />
          <div>
            <h3>{titulo}</h3>

            {descricao && typeof descricao === "object" ? (
              <div className={styles.row}>
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
              <p>{descricao}</p> // caso seja string (cards antigos)
            )}
          </div>
        </div>

        <div className={styles.cardBack}>
          <h4>{titulo}</h4>
          <p>{detalhes}</p>
        </div>
      </div>

      <div className={styles.cardActions}>
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
