// App.js
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./pages/header/header";
import HomePage from "./pages/home/homePage";
import CardsPage from "./pages/series/cardsPage";
import AnimePage from "./pages/animes/animesPage";
import styles from "./App.module.scss";
import { CarrinhoProvider } from "./service/context/useCarrinho";

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CarrinhoProvider>
        <div className={styles.appContainer}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="series" element={<CardsPage />} />
              <Route path="anime" element={<AnimePage />} />
              <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
            </Route>
          </Routes>
        </div>
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

export default App;
