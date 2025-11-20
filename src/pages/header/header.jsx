import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import LoginModal from "./../loginPage/loginModal";
import { useAuth } from "./../../service/context/authProvider";

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

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header id="header" className={styles.header}>
      <h1 className={styles.title}>Melhores Séries</h1>

      <div className={styles.navigationButtons}>
        <button
          className={styles.navButton}
          onClick={() => handleNavigation("/series")}
        >
          Séries
        </button>
        <button
          className={styles.navButton}
          onClick={() => handleNavigation("/anime")}
        >
          Anime
        </button>
      </div>

      <button className={styles.loginBtn} onClick={handleButtonClick}>
        {user ? "Logout" : "Entrar"}
      </button>

      {showLogin && !user && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Header;
