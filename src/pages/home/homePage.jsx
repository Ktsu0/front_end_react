// src/components/homePage/HomePage.jsx

import { useNavigate } from "react-router-dom";
import styles from "./homePage.module.scss";
import Footer from "../footer/footer";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/hookLogin";
import LoginModal from "../loginPage/loginModal";

const YOUTUBE_VIDEO_IDS = [
  "D35RhBgvaKo",
  "WJALwNxZpTg",
  "0MZWCUqIKRo",
  "u9emjalsOsE",
  "6r6d3njza3A",
  "-VzTZoUxxHs",
  "KgCoApvFNAY",
  "a1q5mtEJiAE",
  "J7THUfp4xhA",
  "-cHSj-VCXAU",
  "24alwcXicnY",
  "bz7IRehLf9k",
  "PHvhOPM_5ak",
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPath, setTargetPath] = useState(null);
  const [randomVideoId, setRandomVideoId] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const handleNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setTargetPath(path);
      setIsModalOpen(true);
    }
  };
  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    if (targetPath) {
      navigate(targetPath);
      setTargetPath(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTargetPath(null); // Também limpa o destino caso feche sem logar
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
      {isModalOpen && (
        <LoginModal
          onClose={handleModalClose}
          onLoginSuccess={handleLoginSuccess}
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
