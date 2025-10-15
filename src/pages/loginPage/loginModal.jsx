import { useState } from "react";
import styles from "./loginModal.module.scss";
import { useAuth } from "./../../service/context/authContext";

const LoginModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);

  // Campos de login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Campos de registro
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
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

        await register(email, senha, firstName, lastName); // Passando os dados para registro
        alert("Conta criada com sucesso!");
        // Limpar campos
        setFirstName("");
        setLastName("");
        setEmail("");
        setSenha("");
        setConfirmSenha("");
        onClose(); // Volta para login
      } else {
        await login(email, senha);
        // Limpar campos
        setEmail("");
        setSenha("");
        onClose(); // fecha o modal após login
      }
    } catch (err) {
      alert(err.message);
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
                {" "}
                <label>
                  Nome:{" "}
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />{" "}
                </label>{" "}
                <label>
                  Sobrenome:{" "}
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />{" "}
                </label>{" "}
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

          <button type="submit" className={styles.loginBtn}>
            {isRegister ? "Registrar" : "Entrar"}
          </button>

          {!isRegister && (
            <button
              type="button"
              className={styles.googleBtn}
              onClick={loginWithGoogle}
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
