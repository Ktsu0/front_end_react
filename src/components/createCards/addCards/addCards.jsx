import { useState } from "react";
import styles from "./addCards.module.scss";

const AddCard = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false); // 🚀 ATUALIZAÇÃO 1: Adicionar 'tipo' ao estado inicial

  const [form, setForm] = useState({
    titulo: "",
    descricao: {
      temporada: "",
      tema: "",
    },
    detalhes: "",
    imagem: "",
    estoque: 0 || "",
    valorUnitario: 0.0 || "",
    tipo: "serie", // 💡 NOVO CAMPO: Padrão é 'serie'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value; // Tratar valores numéricos

    if (name === "estoque") {
      newValue = parseInt(value) || 0;
    } else if (name === "valorUnitario") {
      newValue = parseFloat(value.replace(",", ".")) || 0.0;
    }

    if (name === "temporada" || name === "tema") {
      setForm((prev) => ({
        ...prev,
        descricao: {
          ...prev.descricao,
          [name]: newValue,
        },
      }));
    } else {
      // 🚀 ATUALIZAÇÃO 2: Atualizar 'tipo', 'estoque', 'valorUnitario', 'titulo', etc.
      setForm({ ...form, [name]: newValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      estoque: parseInt(form.estoque),
      valorUnitario: parseFloat(form.valorUnitario),
    }; // 💡 Agora, onAdd deve saber qual rota usar (series ou animes)

    onAdd(payload); // Limpa o formulário

    setForm({
      titulo: "",
      descricao: { temporada: "", tema: "" },
      detalhes: "",
      imagem: "",
      estoque: 0,
      valorUnitario: 0.0,
      tipo: "serie", // Reseta para o padrão
    });
    setShowModal(false);
  };

  return (
    <>
      {" "}
      <div className={styles.addCardWrapper} onClick={() => setShowModal(true)}>
        {" "}
        <div className={styles.addCard}>
          <span className={styles.plus}>+</span>{" "}
        </div>{" "}
      </div>{" "}
      {showModal && (
        <div className={styles.addCardModal}>
          {" "}
          <div className={styles.modalContent}>
            <h2>Adicionar Novo Item</h2>{" "}
            <form onSubmit={handleSubmit}>
              {/* 🚀 NOVO CAMPO DE SELEÇÃO */} <label>Tipo de Mídia</label>{" "}
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
              >
                <option value="serie">Série</option>
                <option value="anime">Anime</option>{" "}
              </select>
              <label>Título</label>{" "}
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
              {/* Temporada e Tema lado a lado */}{" "}
              <div className={styles.row}>
                {" "}
                <div>
                  <label>Temporada</label>{" "}
                  <input
                    type="text"
                    name="temporada"
                    value={form.descricao.temporada}
                    onChange={handleChange}
                    required
                  />{" "}
                </div>{" "}
                <div>
                  <label>Tema</label>{" "}
                  <input
                    type="text"
                    name="tema"
                    value={form.descricao.tema}
                    onChange={handleChange}
                    required
                  />{" "}
                </div>{" "}
              </div>
              {/* Valor Unitário e Estoque lado a lado */}{" "}
              <div className={styles.row}>
                {" "}
                <div>
                  <label>Valor Unitário (R$)</label>{" "}
                  <input
                    type="number"
                    step="0.01"
                    name="valorUnitario"
                    value={form.valorUnitario}
                    onChange={handleChange}
                    required
                  />{" "}
                </div>{" "}
                <div>
                  <label>Estoque Inicial</label>{" "}
                  <input
                    type="number"
                    name="estoque"
                    min="0"
                    value={form.estoque}
                    onChange={handleChange}
                    required
                  />{" "}
                </div>{" "}
              </div>
              {/* Fim dos novos campos */} <label>Detalhes</label>{" "}
              <textarea
                name="detalhes"
                value={form.detalhes}
                onChange={handleChange}
                required
              />
              <label>Imagem (URL)</label>{" "}
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={handleChange}
                required
              />{" "}
              <div className={styles.modalButtons}>
                {" "}
                <button type="submit" className={styles.addBtn}>
                  Adicionar{" "}
                </button>{" "}
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </>
  );
};

export default AddCard;
