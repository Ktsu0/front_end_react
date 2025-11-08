import { useNavigate } from "react-router-dom";
import styles from "./homePage.module.scss";
import Footer from "../footer/footer";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/hookLogin";
import LoginModal from "../loginPage/loginModal";

const YOUTUBE_VIDEO_IDS = [
  "X1NEyxE1hs0&list=PLGNuNSzt_-vMK2sKpbs9Re7mSatk3rjUQ&index=3", // SmZinho Cassaco
  "N-uSgDUEe7w&list=PLGNuNSzt_-vMK2sKpbs9Re7mSatk3rjUQ&index=2", // SmZinho U caba Lá
  "O7Qf4PUqv2c&list=PLGNuNSzt_-vMK2sKpbs9Re7mSatk3rjUQ&index=16", // SmZinho Toda Vez!!
  "D35RhBgvaKo", // Demon Slayer
  "ZhtvfN1W5Ag", // Luta epica dragon Ball
  "iRoTg1zv4PI", // Dragon Ball Vegeta Portugal
  "uqBBbkuzCTI", // Dragon Ball Vegeta
  "cU2b8gBhAN8", // Dragon Ball Luta Epic
  "2UWRCA43thQ", // Dragon Ball Goku e Jiren
  "MkRyDBprbYY", // Dragon Ball SuperSayajin 3
  "24alwcXicnY", // Nanatsu no Taizai Escanorrr
  "yrQxKINBTKY", // Musica boa e animação de mau gosto
  "u9emjalsOsE", // Minecraft Style
  "6r6d3njza3A", // Louca na Chapeuzinho
  "-VzTZoUxxHs", // Todo mundo em Pânico
  "0MTzLD4tnIs", // Alanzoka dicção
  "eiz4SxRk-2c", // Respostas incriveis
  "J7THUfp4xhA", // Castor Chines
  "-cHSj-VCXAU", // Luta de Anão
  "bz7IRehLf9k", // Ta pegando fogo
  "PHvhOPM_5ak", // Musica Macaco
  "glymdDVbdUk", // Rabisco Marta
  "ChDof6K--GI", // Marcello
  "vjuG9DWwWnE", // Rock Lee Vs Gaara
  "EXmgKdSssCs", // Eu sou Jesus
  "9Ed19F8W0EI", // God of Duvidoso
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isModlOpen, setIsModalOpen] = useState(false);
  const [targetPath, setTargetPath] = useState(null);
  const [randomVideoId, setRandomVideoId] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const handleAuthButtonClick = () => {
    if (user) {
      logout();
      navigate("/");
    } else {
      setShowLogin(true);
    }
  };

  const handleNavigation = (path) => {
    if (!!user) {
      navigate(path);
    } else {
      setTargetPath(path);
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * YOUTUBE_VIDEO_IDS.length);
    setRandomVideoId(YOUTUBE_VIDEO_IDS[randomIndex]);
  }, []);

  const youtubeEmbedUrl = randomVideoId
    ? `https://www.youtube.com/embed/${randomVideoId}?autoplay=1&controls=0&mute=${
        isMuted ? 1 : 0
      }&loop=1&playlist=${randomVideoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`
    : "";

  return (
    <div className={styles.homeContainer}>
      <button className={styles.loginBtn} onClick={handleAuthButtonClick}>
        {user ? "Sair" : "Entrar"}
      </button>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => setShowLogin(false)}
        />
      )}
      {youtubeEmbedUrl && (
        <iframe
          className={styles.videoBackground}
          src={youtubeEmbedUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Vídeo de Fundo"
        />
      )}
      <div className={styles.contentOverlay}>
        <h1 className={styles.title}>O que Manda Chefe?</h1>
        <img
          className={styles.imagem}
          src="https://media1.tenor.com/m/znx_AntI870AAAAd/gorilla-middle-finger.gif
"
          alt=""
        />
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
        <button
          className={styles.soundToggle}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Ligar Som" : "Desligar Som"}
        >
          {isMuted ? "🔇 Ligar Som" : "🔊 Desligar Som"}
        </button>
      </div>
      <Footer className={styles.footer}></Footer>
    </div>
  );
};

export default HomePage;
