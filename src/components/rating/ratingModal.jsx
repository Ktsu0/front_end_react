import { useState } from "react";
import styles from "./ratingModal.module.scss";
import { FaStar } from "react-icons/fa";

const RatingModal = ({ obraId, titulo, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await onRate(obraId, rating);
      onClose();
    } catch (error) {
      console.error("Erro ao avaliar:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <h3>Avaliar "{titulo}"</h3>
        <p>Como você avalia esta obra?</p>

        <div className={styles.starsWrapper}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${styles.star} ${
                (hover || rating) >= star ? styles.active : ""
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            disabled={rating === 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
