import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import CardsPage from "./pages/series/cardsPage";
import AnimePage from "./pages/animes/animesPage";
import styles from "./App.module.scss";
import { CarrinhoProvider } from "./hooks/hookCarrinho";
import PrivateRoute from "./service/context/privateRote";
import AuthErrorDisplay from "./hooks/hookError/hookErrorDisplay"; // O componente de tela cheia que criamos

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
              {/* Rotas Públicas */}
              <Route index element={<HomePage />} />
              {/* Rotas Protegidas */}
              <Route element={<PrivateRoute />}>
                <Route path="series" element={<CardsPage />} />
                <Route path="anime" element={<AnimePage />} />
              </Route>
              <Route path="auth-error-page" element={<AuthErrorDisplay />} />
              {/* 404 */}
              <Route path="*" element={<h1>404 | Página Não Encontrada</h1>} />
            </Route>
          </Routes>
        </div>
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

export default App;
