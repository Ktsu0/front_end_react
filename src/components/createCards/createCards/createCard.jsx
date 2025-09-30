import styles from "./createCard.module.scss"

const CreateCard = ({ id, titulo, descricao, detalhes, imagem, onEdit, onDelete }) => {
  // Objeto 'cardData' contendo todas as propriedades necessárias para a edição.
  const cardData = { id, titulo, descricao, detalhes, imagem };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardFront}>
          <img src={imagem} alt={titulo} />
          <div>
            <h3>{titulo}</h3>
            <p>{descricao}</p>
          </div>
        </div>
        <div className={styles.cardBack}>
          <h4>{titulo}</h4>
          <p>{detalhes}</p>
        </div>
      </div>
      
      {/* NOVO: Container para os ícones de Ação */}
      <div className={styles.cardActions}>
        {/* Ícone de Editar */}
        <span 
          className={styles.editIcon} 
          onClick={() => onEdit(cardData)} // Passa o objeto completo do card
          title="Editar Card"
        >
          ✏️
        </span>
        {/* Ícone de Deletar */}
        <span 
          className={styles.deleteIcon} 
          onClick={() => onDelete(id)} // Passa apenas o ID para deletar
          title="Deletar Card"
        >
          🗑️
        </span>
      </div>
      {/* FIM NOVO */}
    </div>
  );
};

export default CreateCard;