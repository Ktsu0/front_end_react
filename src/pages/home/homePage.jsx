import { useNavigate } from "react-router-dom";
import styles from "./homePage.module.scss";
import Footer from "../footer/footer";
import Header from "../header/header";
import { useState, useEffect } from "react";

const YOUTUBE_VIDEO_IDS = [
  "X1NEyxE1hs0",
  "N-uSgDUEe7w",
  "O7Qf4PUqv2c",
  "D35RhBgvaKo",
  "ZhtvfN1W5Ag",
  "iRoTg1zv4PI",
  "uqBBbkuzCTI",
  "cU2b8gBhAN8",
  "2UWRCA43thQ",
  "MkRyDBprbYY",
  "24alwcXicnY",
  "yrQxKINBTKY",
  "u9emjalsOsE",
  "6r6d3njza3A",
  "-VzTZoUxxHs",
  "0MTzLD4tnIs",
  "eiz4SxRk-2c",
  "J7THUfp4xhA",
  "-cHSj-VCXAU",
  "bz7IRehLf9k",
  "PHvhOPM_5ak",
  "glymdDVbdUk",
  "ChDof6K--GI",
  "vjuG9DWwWnE",
  "EXmgKdSssCs",
  "9Ed19F8W0EI",
];

const HomePage = () => {
  const navigate = useNavigate();
  const [randomVideoId, setRandomVideoId] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * YOUTUBE_VIDEO_IDS.length);
    setRandomVideoId(YOUTUBE_VIDEO_IDS[randomIndex]);
  }, []);

  const youtubeEmbedUrl = randomVideoId
    ? `https://www.youtube.com/embed/${randomVideoId}?autoplay=1&controls=0&mute=${
        isMuted ? 1 : 0
      }&loop=1&playlist=${randomVideoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&enablejsapi=1`
    : "";

  return (
    <div className={styles.homeContainer}>
      <Header />

      <div className={styles.heroSection}>
        {youtubeEmbedUrl && (
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.videoBackground}
              src={youtubeEmbedUrl}
              allow="autoplay; encrypted-media"
              title="Streaming Experience"
            />
          </div>
        )}

        <div className={styles.contentOverlay}>
          <div className={styles.glassCard}>
            <h1 className={styles.title}>O que vamos assistir hoje?</h1>
            <p className={styles.subtitle}>
              Sua porta de entrada para os melhores universos.
            </p>

            <div className={styles.buttonGroup}>
              <button
                className={styles.navButton}
                onClick={() => navigate("/series")}
              >
                📺 Séries
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigate("/anime")}
              >
                ⛩️ Animes
              </button>
            </div>

            <button
              className={styles.soundToggle}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? "🔇 Clicar para Ouvir" : "🔊 Som Ligado"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
