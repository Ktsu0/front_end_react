// hooks/useAuth.jsx
import { useState, useCallback, useEffect } from "react";
import {
  loginApi,
  registerApi,
  logoutApi,
  getUserRole,
} from "./../service/context/authContext";

export function useAuthController() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Carregar roles do usuário
  // -------------------------------
  const loadUser = useCallback(async () => {
    setLoadingUser(true);
    try {
      const roles = await getUserRole();
      setUser(roles ? { roles } : null);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // -------------------------------
  // Login
  // -------------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      await loginApi(email, password);
      await loadUser();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Registro
  // -------------------------------
  const register = async (data) => {
    setLoading(true);
    try {
      await registerApi(data);
      await loadUser();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Logout
  // -------------------------------
  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  // -------------------------------
  // Valor derivado → Admin?
  // -------------------------------
  const isAdmin = user?.roles?.includes("ADMIN") || false;

  return {
    user,
    isAdmin,
    loading,
    loadingUser,
    login,
    register,
    logout,
    reloadUser: loadUser,
  };
}
