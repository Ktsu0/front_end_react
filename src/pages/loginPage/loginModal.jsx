// components/LoginModal.js (O componente View)

import { useState } from "react";
import styles from "./loginModal.module.scss";
import { useAuth } from "./../../service/context/authProvider";
import { useLoginForm } from "./../../hooks/hookLoginForm"; // Certifique-se de que o caminho está correto

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  // 1. Usa o hook de formulário para obter todos os estados e setters
  const form = useLoginForm(isRegister);

  // 2. Obtém as funções de autenticação do seu hook de Auth
  const { login, register, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (isRegister) {
        // Obtém e valida os dados de registro (a validação lança um erro se falhar)
        const registerData = form.getRegisterData();
        await register(registerData); // Chama a função do seu hook de Auth
      } else {
        await login(form.email, form.password); // Chama a função do seu hook de Auth
      }

      // 3. Limpa os campos e fecha o modal
      form.clearFields();
      onLoginSuccess ? onLoginSuccess() : onClose();
    } catch (err) {
      // Captura erros de validação (do useLoginForm) ou erros da API (do useAuth)
      alert(err.message);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2>{isRegister ? "Criar conta" : "Entrar"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              {/* Nome/Sobrenome */}
              <div className={styles.nameFields}>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => form.setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Sobrenome:
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => form.setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>

              {/* CPF */}
              <label>
                CPF:
                <input
                  type="text"
                  value={form.cpf}
                  onChange={(e) => form.setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </label>

              {/* Telefone */}
              <label>
                Telefone:
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => form.setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </label>

              {/* CEP */}
              <label>
                CEP:
                <input
                  type="text"
                  value={form.cep}
                  onChange={(e) => form.setCep(e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </label>

              {/* Gênero e Nascimento */}
              <div className={styles.genderBirth}>
                <label>
                  Gênero:
                  <select
                    value={form.genero}
                    onChange={(e) => form.setGenero(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não dizer">Prefiro não dizer</option>
                  </select>
                </label>
                <label>
                  Nascimento:
                  <input
                    type="date"
                    value={form.nascimento}
                    onChange={(e) => form.setNascimento(e.target.value)}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {/* E-mail */}
          <label>
            E-mail:
            <input
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              required
            />
          </label>

          {/* Senha */}
          <label>
            Senha:
            <input
              type="password"
              value={form.password}
              onChange={(e) => form.setSenha(e.target.value)}
              required
            />
          </label>

          {/* Confirmação de Senha (apenas Registro) */}
          {isRegister && (
            <label>
              Confirmar Senha:
              <input
                type="password"
                value={form.confirmSenha}
                onChange={(e) => form.setConfirmSenha(e.target.value)}
                required
              />
            </label>
          )}

          {/* Links de Login (apenas Login) */}
          {!isRegister && (
            <div className={styles.links}>
              <a href="#">Esqueceu a senha?</a>
            </div>
          )}

          {/* Botão Principal */}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Aguarde..." : isRegister ? "Registrar" : "Entrar"}
          </button>

          {/* Botão Google (apenas Login) */}
          {!isRegister && (
            <button
              type="button"
              className={styles.googleBtn}
              onClick={loginWithGoogle}
              disabled={loading}
            >
              🔵 Entrar com Google
            </button>
          )}

          {/* Switch de Modo */}
          <p className={styles.switch}>
            {isRegister ? (
              <>
                Já tem conta?{" "}
                <span
                  className={styles.toggleLink}
                  onClick={() => setIsRegister(false)}
                >
                  Entrar
                </span>
              </>
            ) : (
              <>
                Não tem conta?{" "}
                <span
                  className={styles.toggleLink}
                  onClick={() => setIsRegister(true)}
                >
                  Registrar-se
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
