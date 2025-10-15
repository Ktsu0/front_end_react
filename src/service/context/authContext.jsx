import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao logar");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, senha, firstName, lastName) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao registrar");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
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
