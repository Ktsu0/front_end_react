import { useEffect } from "react";
import styles from "./statusModal.module.scss";

const StatusModal = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Fecha automaticamente após 4 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles[type]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.icon}>{icon}</div>
        <div className={styles.content}>
          <p>{message}</p>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <div className={styles.progressBar}></div>
      </div>
    </div>
  );
};

export default StatusModal;
