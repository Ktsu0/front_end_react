import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.scss";
import LoginModal from "./../loginPage/loginModal";
import { useAuth } from "./../../service/context/authProvider";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = () => {
    if (user) {
      logout();
      navigate("/");
    } else {
      setShowLogin(true);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header id="header" className={styles.header}>
      <div className={styles.leftSection}>
        <h1 className={styles.title} onClick={() => navigate("/")}>
          🐦‍🔥
        </h1>
      </div>

      <nav className={styles.navigationButtons}>
        <button
          className={`${styles.navButton} ${isActive("/series") ? styles.active : ""}`}
          onClick={() => handleNavigation("/series")}
        >
          📺 Séries
        </button>
        <button
          className={`${styles.navButton} ${isActive("/anime") ? styles.active : ""}`}
          onClick={() => handleNavigation("/anime")}
        >
          ⛩️ Animes
        </button>
      </nav>

      <div className={styles.rightSection}>
        {user && <span className={styles.userEmail}>{user.email}</span>}
        <button className={styles.loginBtn} onClick={handleButtonClick}>
          {user ? "Sair" : "Entrar"}
        </button>
      </div>

      {showLogin && !user && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => setShowLogin(false)}
        />
      )}
    </header>
  );
};

export default Header;
