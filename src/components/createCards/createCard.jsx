import React from "react";
import styles from "./createCard.module.scss";

const CreateCard = ({ titulo, descricao, detalhes, imagem }) => {
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
    </div>
  );
};

export default CreateCard;
