// hooks/useLoginForm.js
import { useState, useCallback } from "react";

/**
 * Hook customizado para gerenciar todos os campos e estados de um formulário
 * de Login/Registro.
 */
export const useLoginForm = (isRegisterMode) => {
  // Campos de login
  const [email, setEmail] = useState("");
  const [password, setSenha] = useState("");

  // Campos extras de registro
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [genero, setGenero] = useState("");
  const [nascimento, setNascimento] = useState("");

  // Função para limpar todos os campos
  const clearFields = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSenha("");
    setConfirmSenha("");
    setCpf("");
    setTelefone("");
    setCep("");
    setGenero("");
    setNascimento("");
  }, []);

  // Função de validação e retorno dos dados de registro
  const getRegisterData = useCallback(() => {
    // Validação de campos obrigatórios (apenas para o modo Registro)
    if (!isRegisterMode) return {};

    if (
      !firstName ||
      !lastName ||
      !cpf ||
      !telefone ||
      !cep ||
      !genero ||
      !nascimento
    ) {
      throw new Error("Preencha todos os campos obrigatórios!");
    }

    if (!email || !password || password !== confirmSenha) {
      throw new Error("Verifique o e-mail e se as senhas coincidem!");
    }

    // Retorna o objeto de dados pronto para a chamada de API
    return {
      email,
      password,
      firstName,
      lastName,
      Cpf: cpf, // O campo Cpf é com 'C' maiúsculo no seu original
      telefone,
      cep,
      genero,
      nascimento,
    };
  }, [
    isRegisterMode,
    firstName,
    lastName,
    cpf,
    telefone,
    cep,
    genero,
    nascimento,
    email,
    password,
    confirmSenha,
  ]);

  return {
    // Estados expostos (para vincular aos inputs)
    email,
    setEmail,
    password,
    setSenha,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    confirmSenha,
    setConfirmSenha,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    cep,
    setCep,
    genero,
    setGenero,
    nascimento,
    setNascimento,
    // Funções de utilidade
    clearFields,
    getRegisterData,
  };
};
