import React, { useState, useEffect } from "react";
import styles from "./../addCards/addCards.module.scss";

const EditCardModal = ({ cardToEdit, onEdit, onClose }) => {
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    descricao: { temporada: "", tema: "" },
    detalhes: "",
    imagem: "",
  });

  useEffect(() => {
    if (cardToEdit) {
      setForm({
        ...cardToEdit,
        descricao:
          typeof cardToEdit.descricao === "object"
            ? cardToEdit.descricao
            : { temporada: cardToEdit.descricao || "", tema: "" },
      });
    }
  }, [cardToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "temporada" && name !== "tema") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({
        ...form,
        descricao: { ...form.descricao, [name]: value },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(form.id, form);
    onClose();
  };

  if (!cardToEdit) return null;

  return (
    <div className={styles.addCardModal}>
      <div className={styles.modalContent}>
        <h2>Editar Card: {form.titulo}</h2>
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

          <div className={styles.modalButtons}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
