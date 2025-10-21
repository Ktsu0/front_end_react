import { useState, useEffect } from "react";
import styles from "./../addCards/addCards.module.scss"; // Assumindo que este é o CSS correto

const EditCardModal = ({ cardToEdit, onEdit, onClose }) => {
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    descricao: { temporada: "", tema: "" },
    detalhes: "",
    imagem: "",
    // 🚀 NOVOS CAMPOS INICIAIS
    estoque: 0,
    valorUnitario: 0.0,
  });

  useEffect(() => {
    if (cardToEdit) {
      setForm({
        ...cardToEdit,
        // Garante que a descrição seja um objeto, tratando o valor antigo como temporada se for string
        descricao:
          typeof cardToEdit.descricao === "object"
            ? cardToEdit.descricao
            : { temporada: cardToEdit.descricao || "", tema: "" },
        // 🚀 GARANTE QUE OS VALORES NUMÉRICOS SEJAM TRANSFERIDOS
        estoque: cardToEdit.estoque || 0,
        valorUnitario: cardToEdit.valorUnitario || 0.0,
      });
    }
  }, [cardToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // A lógica de `handleChange` não precisa ser alterada, pois os novos campos estarão desabilitados
    // e não dispararão o evento de mudança (onChange).
    if (name !== "temporada" && name !== "tema") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({
        ...form,
        descricao: { ...form.descricao, [name]: value },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚀 ATENÇÃO: É CRÍTICO GARANTIR QUE ESTOQUE E VALOR SEJAM INCLUÍDOS NO PAYLOAD!
    // Como eles não são alterados, eles vêm diretamente do estado 'form'.
    const payload = {
      ...form,
      descricao: { ...form.descricao },
      // Garante que o valorUnitario seja um float
      valorUnitario: parseFloat(form.valorUnitario),
      // Garante que o estoque seja um inteiro
      estoque: parseInt(form.estoque),
    };

    await onEdit(form.id, payload);
    onClose();
  };

  if (!cardToEdit) return null;

  return (
    <div className={styles.addCardModal}>
      <div className={styles.modalContent}>
        <h2>Editar Card: {form.titulo || "Sem título"}</h2>
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

          {/* 🚀 NOVOS CAMPOS DESABILITADOS (Valor e Estoque) */}
          <div className={styles.row}>
            <div>
              <label>Valor Unitário (R$)</label>
              <input
                type="text" // Usamos text para formatar, mas é desabilitado
                name="valorUnitario"
                value={
                  form.valorUnitario ? form.valorUnitario.toFixed(2) : "0.00"
                }
                disabled // 👈 CRÍTICO: Desabilita a edição
              />
            </div>
            <div>
              <label>Estoque Disponível</label>
              <input
                type="number"
                name="estoque"
                value={form.estoque}
                disabled // 👈 CRÍTICO: Desabilita a edição
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
