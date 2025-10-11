import React, { useState } from "react";
import styles from "./addCards.module.scss";

const AddCard = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: {
      temporada: "",
      tema: "",
    },
    detalhes: "",
    imagem: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "temporada" || name === "tema") {
      setForm((prev) => ({
        ...prev,
        descricao: {
          ...prev.descricao,
          [name]: value,
        },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = String(Date.now());
    const newCardWithId = { ...form, id: newId };
    onAdd(newCardWithId);

    // limpa o formulário
    setForm({
      titulo: "",
      descricao: { temporada: "", tema: "" },
      detalhes: "",
      imagem: "",
    });
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.addCardWrapper} onClick={() => setShowModal(true)}>
        <div className={styles.addCard}>
          <span className={styles.plus}>+</span>
        </div>
      </div>

      {showModal && (
        <div className={styles.addCardModal}>
          <div className={styles.modalContent}>
            <h2>Adicionar Nova Série</h2>
            <form onSubmit={handleSubmit}>
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />

              {/* Temporada e Tema lado a lado */}
              <div className={styles.row}>
                <div>
                  <label>Temporada</label>
                  <input
                    type="text"
                    name="temporada"
                    value={form.descricao.temporada}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Tema</label>
                  <input
                    type="text"
                    name="tema"
                    value={form.descricao.tema}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label>Detalhes</label>
              <textarea
                name="detalhes"
                value={form.detalhes}
                onChange={handleChange}
                required
              />

              <label>Imagem (URL)</label>
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={handleChange}
                required
              />

              <div className={styles.buttons}>
                <button type="submit" className={styles.addBtn}>
                  Adicionar
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCard;
