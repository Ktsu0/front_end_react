import { useState } from "react";
import styles from "./addCards.module.scss";

const AddCard = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    meta: {
      temporada: "",
      tema: "",
    },
    detalhes: "",
    imagem: "",
    estoque: 0,
    valorUnitario: 0.0,
    tipo: "serie",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "estoque") {
      newValue = parseInt(value) || 0;
    } else if (name === "valorUnitario") {
      newValue = parseFloat(value.replace(",", ".")) || 0.0;
    }

    if (name === "temporada" || name === "tema") {
      setForm((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: newValue,
        },
      }));
    } else {
      setForm({ ...form, [name]: newValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      estoque: parseInt(form.estoque),
      valorUnitario: parseFloat(form.valorUnitario),
    };

    onAdd(payload);

    setForm({
      titulo: "",
      meta: { temporada: "", tema: "" },
      detalhes: "",
      imagem: "",
      estoque: 0,
      valorUnitario: 0.0,
      tipo: "serie",
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
            <h2>✨ Adicionar Novo Item</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Tipo de Mídia</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="serie">📺 Série</option>
                  <option value="anime">⛩️ Anime</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Título da Obra</label>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Ex: Breaking Bad"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Temporada/Volume</label>
                  <input
                    type="text"
                    name="temporada"
                    placeholder="Ex: 5 Temporadas"
                    value={form.meta.temporada}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Gênero / Tema</label>
                  <input
                    type="text"
                    name="tema"
                    placeholder="Ex: Drama / Crime"
                    value={form.meta.tema}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Valor Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valorUnitario"
                    placeholder="0.00"
                    value={form.valorUnitario}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estoque Inicial</label>
                  <input
                    type="number"
                    name="estoque"
                    min="0"
                    placeholder="0"
                    value={form.estoque}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Sobre a obra</label>
                <textarea
                  name="detalhes"
                  placeholder="Escreva uma breve sinopse..."
                  value={form.detalhes}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL da Capa (Imagem)</label>
                <input
                  type="text"
                  name="imagem"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={form.imagem}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitBtn}>
                  🚀 Criar Card
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
