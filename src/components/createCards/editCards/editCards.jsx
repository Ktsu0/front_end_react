import { useState, useEffect } from "react";
import styles from "./../addCards/addCards.module.scss";

const EditCardModal = ({ cardToEdit, onEdit, onClose }) => {
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    meta: { temporada: "", tema: "" },
    detalhes: "",
    imagem: "",
    estoque: 0,
    valorUnitario: 0.0,
    tipo: "serie",
  });

  useEffect(() => {
    if (cardToEdit) {
      setForm({
        ...cardToEdit,
        meta:
          typeof cardToEdit.meta === "object"
            ? cardToEdit.meta
            : { temporada: cardToEdit.meta || "", tema: "" },
        estoque: cardToEdit.estoque || 0,
        valorUnitario: cardToEdit.valorUnitario || 0.0,
        tipo: cardToEdit.tipo || "serie",
      });
    }
  }, [cardToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "estoque") {
      newValue = parseInt(value) || 0;
    } else if (name === "valorUnitario") {
      newValue = parseFloat(value.replace(",", ".")) || 0.0;
    }

    if (name !== "temporada" && name !== "tema") {
      setForm({ ...form, [name]: newValue });
    } else {
      setForm({
        ...form,
        meta: { ...form.meta, [name]: newValue },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      meta: { ...form.meta },
      valorUnitario: parseFloat(form.valorUnitario),
      estoque: parseInt(form.estoque),
    };
    await onEdit(form.id, payload);
    onClose();
  };

  if (!cardToEdit) return null;

  const displayTipo = form.tipo === "serie" ? "📺 Série" : "⛩️ Anime";

  return (
    <div className={styles.addCardModal}>
      <div className={styles.modalContent}>
        <h2>📝 Editar Obra</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tipo de Mídia</label>
            <input type="text" name="tipo" value={displayTipo} disabled />
          </div>

          <div className={styles.formGroup}>
            <label>Título da Obra</label>
            <input
              type="text"
              name="titulo"
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
                value={form.meta.tema}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Preço Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                name="valorUnitario"
                value={form.valorUnitario}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Quantidade em Estoque</label>
              <input
                type="number"
                name="estoque"
                value={form.estoque}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Sinopse / Detalhes</label>
            <textarea
              name="detalhes"
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
              value={form.imagem}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.submitBtn}>
              💾 Salvar Alterações
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
