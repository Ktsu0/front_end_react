import { useNavigate } from "react-router-dom";
import styles from "./homePage.module.scss";
import Footer from "../footer/footer";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>O que você quer assistir hoje?</h1>

      <div className={styles.buttonGroup}>
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
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
