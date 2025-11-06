import { useState, useEffect } from "react";
import styles from "./../addCards/addCards.module.scss"; // Assumindo que este é o CSS correto

const EditCardModal = ({ cardToEdit, onEdit, onClose }) => {
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    descricao: { temporada: "", tema: "" },
    detalhes: "",
    imagem: "", // 🚀 NOVOS CAMPOS INICIAIS
    estoque: 0,
    valorUnitario: 0.0,
    tipo: "serie", // 💡 NOVO: Inicializa o tipo
  });

  useEffect(() => {
    if (cardToEdit) {
      setForm({
        ...cardToEdit, // Garante que a descrição seja um objeto
        descricao:
          typeof cardToEdit.descricao === "object"
            ? cardToEdit.descricao
            : { temporada: cardToEdit.descricao || "", tema: "" }, // GARANTE QUE OS VALORES NUMÉRICOS E O TIPO SEJAM TRANSFERIDOS
        estoque: cardToEdit.estoque || 0,
        valorUnitario: cardToEdit.valorUnitario || 0.0,
        tipo: cardToEdit.tipo || "serie", // 💡 NOVO: Carrega o tipo do card
      });
    }
  }, [cardToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 💡 ATENÇÃO: A lógica de edição deve permitir a alteração de ESTOQUE e VALOR se for necessário.
    // Se o objetivo é apenas editar TÍTULO, DETALHES, IMAGEM e DESCRIÇÃO, mantenha o estoque/valor
    // desabilitados, mas inclua-os no payload final (como você já fez).

    let newValue = value;

    // Se você quiser permitir a edição de estoque e valor no modal, descomente e ajuste esta lógica:
    // if (name === "estoque") {
    //   newValue = parseInt(value) || 0;
    // } else if (name === "valorUnitario") {
    //   newValue = parseFloat(value.replace(",", ".")) || 0.0;
    // }

    if (name !== "temporada" && name !== "tema") {
      setForm({ ...form, [name]: newValue });
    } else {
      setForm({
        ...form,
        descricao: { ...form.descricao, [name]: newValue },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      descricao: { ...form.descricao }, // Garante que os números sejam enviados no formato correto
      valorUnitario: parseFloat(form.valorUnitario),
      estoque: parseInt(form.estoque),
      // 💡 O 'tipo' já está embutido no '...form'
    };

    await onEdit(form.id, payload); // onEdit precisa de ID e payload completo, incluindo o tipo
    onClose();
  };

  if (!cardToEdit) return null;

  // Exibição formatada do tipo (ex: 'serie' -> 'Série')
  const displayTipo = form.tipo
    ? form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1)
    : "Não definido";

  return (
    <div className={styles.addCardModal}>
      {" "}
      <div className={styles.modalContent}>
        <h2>Editar Card: {form.titulo || "Sem título"}</h2>{" "}
        <form onSubmit={handleSubmit}>
          {/* 💡 NOVO CAMPO: EXIBIÇÃO DO TIPO (DESABILITADO) */}
          <label>Tipo de Mídia</label>
          <input
            type="text"
            name="tipo"
            value={displayTipo}
            disabled // O tipo não deve ser alterado
          />
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
          {/* CAMPOS DESABILITADOS (Valor e Estoque) */}{" "}
          <div className={styles.row}>
            {" "}
            <div>
              <label>Valor Unitário (R$)</label>{" "}
              <input
                type="text"
                name="valorUnitario"
                value={
                  form.valorUnitario ? form.valorUnitario.toFixed(2) : "0.00"
                }
                disabled
              />{" "}
            </div>{" "}
            <div>
              <label>Estoque Disponível</label>{" "}
              <input
                type="number"
                name="estoque"
                value={form.estoque}
                disabled
              />{" "}
            </div>{" "}
          </div>
          <label>Detalhes</label>{" "}
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
            <button type="submit">Salvar</button>{" "}
            <button type="button" onClick={onClose}>
              Cancelar{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default EditCardModal;
