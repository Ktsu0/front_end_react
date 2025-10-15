import { useState } from "react";
import styles from "./header.module.scss";
import LoginModal from "./../loginPage/loginModal";
import { useAuth } from "./../../service/context/authContext";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();

  const handleButtonClick = () => {
    if (user) {
      logout();
    } else {
      setShowLogin(true);
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Melhores Séries</h1>

      <button className={styles.loginBtn} onClick={handleButtonClick}>
        {user ? "Logout" : "Entrar"}
      </button>

      {showLogin &&
        !user && ( // só mostra modal se não estiver logado
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
    </header>
  );
};

export default Header;
