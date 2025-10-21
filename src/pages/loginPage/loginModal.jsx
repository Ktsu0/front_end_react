import { useState } from "react";
import styles from "./loginModal.module.scss";
import { useAuth } from "../../hooks/hookLogin";

const LoginModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  // Campos de login/registro (Lógica de estado de UI)
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Campos de registro (Lógica de estado de UI)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const { login, register, loginWithGoogle, loading } = useAuth(); // Obtém as funções do Contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Evita envio duplo

    try {
      if (isRegister) {
        // Lógica de validação de UI
        if (!firstName || !lastName) {
          alert("Preencha nome e sobrenome!");
          return;
        }
        if (!email) {
          alert("Preencha um email válido!");
          return;
        }
        if (!senha || senha !== confirmSenha) {
          alert("As senhas não coincidem!");
          return;
        }

        // Chamada de lógica (Função do Contexto)
        await register(email, senha, firstName, lastName);
        alert("Conta criada com sucesso!");
      } else {
        // Chamada de lógica (Função do Contexto)
        await login(email, senha);
      }

      // Limpar campos e fechar modal após sucesso
      setFirstName("");
      setLastName("");
      setEmail("");
      setSenha("");
      setConfirmSenha("");
      onClose();
    } catch (err) {
      alert(err.message); // Trata o erro (lançado pelo Contexto)
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2>{isRegister ? "Registrar-se" : "Entrar"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className={styles.nameFields}>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Sobrenome:
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>
            </>
          )}

          <label>
            E-mail:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha:
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {isRegister && (
            <label>
              Repetir Senha:
              <input
                type="password"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required
              />
            </label>
          )}

          {!isRegister && (
            <div className={styles.links}>
              <a href="#">Esqueceu a senha?</a>
            </div>
          )}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Aguarde..." : isRegister ? "Registrar" : "Entrar"}
          </button>

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
                  tabIndex="0"
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
