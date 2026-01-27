// components/LoginModal.js
import { useState } from "react";
import styles from "./loginModal.module.scss";
import { useAuth } from "./../../service/context/authProvider";
import { useLoginForm } from "./../../hooks/hookLoginForm";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  // Estados de visualização: 'login', 'register', 'forgot'
  const [view, setView] = useState("login");

  const isRegister = view === "register";
  const isForgot = view === "forgot";

  // Hook de formulário
  const form = useLoginForm(isRegister);

  // Hook de Auth
  const { login, register, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (view === "register") {
        const registerData = form.getRegisterData();
        await register(registerData);
      } else if (view === "login") {
        await login(form.email, form.password);
      } else if (view === "forgot") {
        // Lógica de recuperação (exemplo: alerta de sucesso)
        alert(`Um e-mail de recuperação foi enviado para: ${form.email}`);
        setView("login");
        return;
      }

      form.clearFields();
      onLoginSuccess ? onLoginSuccess() : onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} type="button">
          ✕
        </button>

        <h2>
          {isForgot
            ? "Recuperar Senha"
            : isRegister
              ? "Criar conta"
              : "Bem-vindo"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className={styles.nameFields}>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => form.setFirstName(e.target.value)}
                    placeholder="João"
                    required
                  />
                </label>
                <label>
                  Sobrenome:
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => form.setLastName(e.target.value)}
                    placeholder="Silva"
                    required
                  />
                </label>
              </div>

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
            </>
          )}

          {/* E-mail (Sempre visível ou apenas no Forgot/Login/Register) */}
          <label>
            E-mail:
            <input
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </label>

          {/* Senha (Apenas em Login/Register) */}
          {!isForgot && (
            <label>
              Senha:
              <input
                type="password"
                value={form.password}
                onChange={(e) => form.setSenha(e.target.value)}
                placeholder="********"
                required
              />
            </label>
          )}

          {/* Confirmação de Senha (apenas Registro) */}
          {isRegister && (
            <label>
              Confirmar Senha:
              <input
                type="password"
                value={form.confirmSenha}
                onChange={(e) => form.setConfirmSenha(e.target.value)}
                placeholder="********"
                required
              />
            </label>
          )}

          {/* Link para Esqueci Senha (apenas em Login) */}
          {view === "login" && (
            <div className={styles.links}>
              <span
                className={styles.toggleLink}
                onClick={() => setView("forgot")}
              >
                Esqueceu a senha?
              </span>
            </div>
          )}

          {/* Botão Principal */}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading
              ? "Aguarde..."
              : isForgot
                ? "Enviar Link"
                : isRegister
                  ? "Finalizar Cadastro"
                  : "Entrar na Conta"}
          </button>

          {/* Botão Google (apenas Login) */}
          {view === "login" && (
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
            {isForgot ? (
              <>
                Lembrou a senha?{" "}
                <span
                  className={styles.toggleLink}
                  onClick={() => setView("login")}
                >
                  Voltar ao Login
                </span>
              </>
            ) : isRegister ? (
              <>
                Já possuo uma conta?{" "}
                <span
                  className={styles.toggleLink}
                  onClick={() => setView("login")}
                >
                  Entrar aqui
                </span>
              </>
            ) : (
              <>
                Novo por aqui?{" "}
                <span
                  className={styles.toggleLink}
                  onClick={() => setView("register")}
                >
                  Crie sua conta
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
