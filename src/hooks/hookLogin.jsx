// service/context/authContext.js (Versão Refatorada)

import { createContext, useState, useContext } from "react";
import { loginApi, registerApi } from "./../service/context/authContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializa o estado do usuário, tentando carregar do localStorage na primeira renderização
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      // Chama a função da API pura (Service)
      const data = await loginApi(email, senha);

      // Atualiza o estado e o localStorage (Lógica do Contexto/Hook)
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      // Re-lança o erro para o componente de UI tratar (ex: LoginModal)
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, senha, firstName, lastName) => {
    setLoading(true);
    try {
      // Chama a função da API pura (Service)
      const data = await registerApi(email, senha, firstName, lastName);

      // Atualiza o estado e o localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    alert("Login com Google ainda não implementado 😅");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = () => useContext(AuthContext);
