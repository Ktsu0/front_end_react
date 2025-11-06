import { useState } from "react";
import styles from "./loginModal.module.scss";
import { useAuth } from "../../hooks/hookLogin";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

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

  const { login, register, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (isRegister) {
        // Validação básica antes de enviar
        if (
          !firstName ||
          !lastName ||
          !cpf ||
          !telefone ||
          !cep ||
          !genero ||
          !nascimento
        ) {
          alert("Preencha todos os campos obrigatórios!");
          return;
        }

        if (!email || !password || password !== confirmSenha) {
          alert("Verifique o e-mail e se as senhas coincidem!");
          return;
        }

        await register({
          email,
          password,
          firstName,
          lastName,
          Cpf: cpf,
          telefone,
          cep,
          genero,
          nascimento,
        });
      } else {
        await login(email, password);
      }

      // Limpa campos
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

      onLoginSuccess ? onLoginSuccess() : onClose();
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

        <h2>{isRegister ? "Criar conta" : "Entrar"}</h2>

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

              <label>
                CPF:
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </label>

              <label>
                Telefone:
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </label>

              <label>
                CEP:
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </label>

              <div className={styles.genderBirth}>
                <label>
                  Gênero:
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
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
                    value={nascimento}
                    onChange={(e) => setNascimento(e.target.value)}
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
              value={password}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {isRegister && (
            <label>
              Confirmar Senha:
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
