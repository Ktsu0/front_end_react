import React, { useState } from "react";
import styles from "./addCards.module.scss";

// Recebe a função 'onAdd' (POST) do useCards
const AddCard = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    // Estado inicial LIMPO
    titulo: "",
    descricao: "",
    detalhes: "",
    imagem: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lógica CRÍTICA: Gerar ID de timestamp para o NOVO card
    const newId = String(Date.now());
    const newCardWithId = { ...form, id: newId };
    
    onAdd(newCardWithId); // Chama a função addCard do useCards

    // Limpa o estado e fecha o modal
    setForm({ titulo: "", descricao: "", detalhes: "", imagem: "" });
    setShowModal(false);
  };

  return (
    <>
      {/* Botão de Adicionar (+) */}
      <div className={styles.addCardWrapper} onClick={() => setShowModal(true)}>
        <div className={styles.addCard}>
          <span className={styles.plus}>+</span>
        </div>
      </div>

      {/* Modal de Adicionar Card */}
      {showModal && (
        <div className={styles.addCardModal}>
          <div className={styles.modalContent}>
            <h2>Adicionar Novo Card</h2>
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
                <button type="submit">Adicionar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCard;