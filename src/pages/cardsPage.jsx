import React from "react";
import styles from "./cardsPage.module.scss";
import CreateCard from "../components/createCards/createCard";
import { useCards } from './../service/model/bancoDados';

const CardsPage = () => {
  const cards = useCards(); // aqui ele já retorna os cards

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>Melhores Séries</header>

      <main className={styles.cardsContainer}>
        {cards.map((card) => (
          <CreateCard key={card.id} {...card} />
        ))}
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} - Desenvolvido por Gabriel Wagner | Contato:
        gabrielwag971@gmail.com
      </footer>
    </div>
  );
};

export default CardsPage;
