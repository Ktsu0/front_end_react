import React, { useState, useEffect } from "react";
import styles from "./../addCards/addCards.module.scss"

// Recebe o card (cardToEdit) e as funções de edição (onEdit) e fechamento (onClose)
const EditCardModal = ({ cardToEdit, onEdit, onClose }) => {
  // Inicializa o estado do form com os dados do card a ser editado
  const [form, setForm] = useState(cardToEdit || {});

  // Atualiza o estado do formulário se o cardToEdit mudar
  useEffect(() => {
    if (cardToEdit) {
      setForm(cardToEdit);
    }
  }, [cardToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lógica CRÍTICA: Usa o ID EXISTENTE (form.id) para a edição.
    onEdit(form.id, form); // Chama a função editCard do useCards

    onClose(); // Fecha o modal após a edição
  };

  // Se não houver card para editar, não renderiza nada
  if (!cardToEdit) return null;

  return (
    <div className={styles.addCardModal}>
      <div className={styles.modalContent}>
        <h2>Editar Card: {form.titulo}</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos do Formulário */}
          <label>Título</label>
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required />
          
          <label>Descrição</label>
          <input type="text" name="descricao" value={form.descricao} onChange={handleChange} required />

          <label>Detalhes</label>
          <textarea name="detalhes" value={form.detalhes} onChange={handleChange} required />

          <label>Imagem (URL)</label>
          <input type="text" name="imagem" value={form.imagem} onChange={handleChange} required />

          <div style={{ display: "flex", gap: "1vw", justifyContent: "center", marginTop: "2vh" }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;