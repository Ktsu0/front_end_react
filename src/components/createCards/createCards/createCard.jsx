import { useState } from "react";
import styles from "./createCard.module.scss";
import { FaStar } from "react-icons/fa";
import RatingModal from "../../rating/ratingModal";

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
  onRate,
  isAdmin,
  avaliacao,
  votos,
}) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
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

        <img src={imagem} alt={titulo} loading="lazy" translate="no" />

        <div className={styles.infoOverlay}>
          <h3 translate="no" className="notranslate">
            {titulo}
          </h3>

          <div className={styles.metaInfo}>
            {meta?.temporada && <span>{meta.temporada}</span>}
            {meta?.tema && <span>{meta.tema}</span>}
          </div>

          <div className={styles.price}>
            <small>R$</small>{" "}
            {valorUnitario ? valorUnitario.toFixed(2) : "0.00"}
          </div>
        </div>

        <div
          className={styles.ratingInfo}
          title={
            votos > 0
              ? `Média: ${avaliacao} (${votos} votos)`
              : "Ainda não avaliado"
          }
          onClick={(e) => {
            console.log("Clique na estrela acionado!");
            e.stopPropagation();
            setShowRatingModal(true);
          }}
        >
          <FaStar className={styles.starIcon} />
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
          <p>{detalhes}</p>
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          obraId={id}
          titulo={titulo}
          onClose={() => setShowRatingModal(false)}
          onRate={onRate}
        />
      )}
    </div>
  );
};

export default CreateCard;
