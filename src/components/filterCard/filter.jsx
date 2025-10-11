import React, { useState, useEffect } from "react";
import styles from "./filter.module.scss";
import useCards from "./../../service/model/bancoDados";

const FilterPanel = ({ onFilter }) => {
  const { cards } = useCards();
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [temaId, setTemaId] = useState("");
  const [ordem, setOrdem] = useState("asc");
  const [avaliacao, setAvaliacao] = useState("");

  // Normaliza o texto (igual ao backend)
  const normalize = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const temaMap = {};
  const uniqueNormalizedTemas = new Set();

  cards.forEach((c) => {
    const temasRaw = c.descricao?.tema || "";
    const temasSeparados = temasRaw
      .split("/")
      .map((t) => t.trim())
      .filter((t) => t);

    temasSeparados.forEach((tema) => {
      const key = normalize(tema);
      if (key) {
        uniqueNormalizedTemas.add(key);
        if (!temaMap[key]) temaMap[key] = tema;
      }
    });
  });

  const uniqueTemas = Array.from(uniqueNormalizedTemas).sort();
  // Atualiza os filtros sempre que o usuário muda algo
  useEffect(() => {
    let temp = [...cards];
    if (searchTerm) {
      const normalizedSearch = normalize(searchTerm);
      temp = temp.filter((c) => {
        const title = c.titulo || "";
        return normalize(title).includes(normalizedSearch);
      });
    }
    if (avaliacao) {
      temp = temp.filter((c) => Number(c.avaliacao) >= Number(avaliacao));
    }
    if (temaId) {
      temp = temp.filter((c) => {
        const temasRaw = c.descricao?.tema || "";
        const temasSerie = temasRaw
          .split("/")
          .map((t) => normalize(t))
          .filter((t) => t);

        return temasSerie.includes(temaId);
      });
    }

    // 3. Ordena alfabeticamente
    temp.sort((a, b) => {
      if (ordem === "asc") return a.titulo.localeCompare(b.titulo);
      return b.titulo.localeCompare(a.titulo);
    });

    // Envia a lista filtrada/ordenada para o componente pai
    onFilter(temp);
  }, [searchTerm, temaId, ordem, avaliacao, cards, normalize, onFilter]); // Adicionei normalize e onFilter às dependências para evitar warnings

  // Limpar filtros
  const handleReset = () => {
    setSearchTerm("");
    setTemaId("");
    setOrdem("asc");
    setAvaliacao("");
  };

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={() => setShow(!show)}
        title="Abrir Filtros"
      >
        {show ? "❌" : "🔍"}
      </button>
      <div className={`${styles.panel} ${show ? styles.open : ""}`}>
        <h3>Filtros de Séries</h3>

        <div className={styles.filterGroup}>
          <label htmlFor="search-input">Buscar por Título:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Ex: The Last of Us"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          {" "}
          <label htmlFor="tema-select">Tema:</label>
          <select
            id="tema-select"
            value={temaId}
            onChange={(e) => setTemaId(e.target.value)}
          >
            <option value="">Todos os Temas</option>
            {uniqueTemas.map((tema) => (
              <option key={tema} value={tema}>
                {temaMap[tema]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="ordem-select">Ordem Alfabética:</label>
          <select
            id="ordem-select"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
          >
            <option value="asc">A → Z (Crescente)</option>
            <option value="desc">Z → A (Decrescente)</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="avaliacao-input">Avaliação Mínima:</label>
          <input
            id="avaliacao-input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={avaliacao}
            onChange={(e) => setAvaliacao(e.target.value)}
          />
        </div>
        <button className={styles.resetButton} onClick={handleReset}>
          Limpar Filtros
        </button>
      </div>

      {show && (
        <div className={styles.overlay} onClick={() => setShow(false)}></div>
      )}
    </>
  );
};

export default FilterPanel;
