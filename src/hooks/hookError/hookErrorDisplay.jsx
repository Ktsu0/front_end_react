// src/components/AuthErrorDisplay/AuthErrorDisplay.jsximport { useNavigate } from "react-router-dom";
import styles from "./hookErrorDisplay.module.scss";
import { useNavigate } from "react-router-dom";

const AuthErrorDisplay = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Sessão Expirada{" "}
        <span role="img" aria-label="hourglass">
          ⏳
        </span>
      </h1>
      <p className={styles.message}>
        Sua sessão de usuário expirou por motivos de segurança. Por favor, faça
        login novamente.
      </p>

      <div className={styles.actions}>
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Fazer Login
        </button>
        <button className={styles.homeBtn} onClick={() => navigate("/")}>
          Ir para Home
        </button>
      </div>
    </div>
  );
};

export default AuthErrorDisplay;
