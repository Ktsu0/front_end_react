import { useState, useCallback } from "react";

const AUTH_ERROR_MESSAGE = "Sessão inválida. Faça login novamente.";

/**
 * Hook customizado para detectar e gerenciar o estado de erro de autenticação.
 * @returns {Object} { isAuthError, handleApiError }
 */
export function useAuthError() {
  const [isAuthError, setIsAuthError] = useState(false);

  /**
   * Função para processar o erro lançado por uma chamada de API.
   * @param {Error} error - O objeto Error capturado no bloco try...catch.
   * @returns {string | null} A mensagem de erro geral ou null se for um erro de Auth.
   */

  const handleApiError = useCallback((error) => {
    if (error && error.message === AUTH_ERROR_MESSAGE) {
      setIsAuthError(true);
      return null; // Indica que o componente não precisa lidar com esse erro como um erro geral.
    }

    // Se não for um erro de autenticação, retorne a mensagem para exibição normal de erro.
    return error ? error.message : "Erro desconhecido.";
  }, []);

  return {
    isAuthError,
    handleApiError,
  };
}
