// App.js
import React from "react";
import CardsPage from "./pages/cardsPage"; // ajuste conforme o caminho
import styles from "./App.module.scss";
import { CarrinhoProvider } from "./service/context/useCarrinho";

function App() {
  return (
    <CarrinhoProvider>
      <div className={styles.appContainer}>
        <CardsPage />
      </div>
    </CarrinhoProvider>
  );
}

export default App;
