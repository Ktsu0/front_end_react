// App.js
import React from "react";
import CardsPage from "./pages/cardsPage"; // ajuste conforme o caminho
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.appContainer}>
      <CardsPage />
    </div>
  );
}

export default App;
