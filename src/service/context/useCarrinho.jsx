import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

// 💡 Base URL ajustada conforme sua requisição (porta 5000)
const BASE_URL = "http://localhost:5000";

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children, fetchCards }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [validacao, setValidacao] = useState(null);
  const [loadingValidacao, setLoadingValidacao] = useState(false);

  // -----------------------------------------------------------
  // Funções de Manipulação Local
  // -----------------------------------------------------------

  const adicionarAoCarrinho = useCallback((cardData, quantidade = 1) => {
    setCarrinho((prevCarrinho) => {
      // Verifica se já existe um item com mesmo id e tipo
      const itemExistente = prevCarrinho.find(
        (item) => item.produtoId === cardData.id && item.tipo === cardData.tipo
      );

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidadeDesejada + quantidade;

        if (novaQuantidade > cardData.estoque) {
          alert(
            `Não é possível adicionar mais. Limite de estoque é ${cardData.estoque} unidades.`
          );
          return prevCarrinho;
        }

        return prevCarrinho.map((item) =>
          item.produtoId === cardData.id && item.tipo === cardData.tipo
            ? { ...item, quantidadeDesejada: novaQuantidade }
            : item
        );
      } else {
        if (quantidade > cardData.estoque) {
          alert(
            `Não é possível adicionar. Limite de estoque é ${cardData.estoque} unidades.`
          );
          return prevCarrinho;
        }
        return [
          ...prevCarrinho,
          {
            produtoId: cardData.id,
            titulo: cardData.titulo,
            valorUnitario: cardData.valorUnitario,
            quantidadeDesejada: quantidade,
            estoqueDisponivel: cardData.estoque,
            tipo: cardData.tipo,
          },
        ];
      }
    });
  }, []);

  const removerDoCarrinho = useCallback((produtoId, tipo) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter(
        (item) => !(item.produtoId === produtoId && item.tipo === tipo)
      )
    );
  }, []);

  const atualizarQuantidade = useCallback(
    (produtoId, tipo, novaQuantidade) => {
      if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId, tipo);
        return;
      }

      setCarrinho((prevCarrinho) =>
        prevCarrinho.map((item) => {
          if (item.produtoId === produtoId && item.tipo === tipo) {
            const estoqueMaximo = item.estoqueDisponivel;
            return {
              ...item,
              quantidadeDesejada: Math.min(novaQuantidade, estoqueMaximo),
            };
          }
          return item;
        })
      );
    },
    [removerDoCarrinho]
  );

  const limparCarrinho = useCallback(() => {
    setCarrinho([]);
    setValidacao(null);
  }, []);

  // -----------------------------------------------------------
  // Comunicação com API
  // -----------------------------------------------------------

  const validarCarrinhoAPI = useCallback(async () => {
    const itensParaAPI = carrinho.map((item) => ({
      id: item.produtoId,
      quantidade: item.quantidadeDesejada,
      tipo: item.tipo,
    }));

    // 🔹 Log do que será enviado
    console.log("Itens enviados para validação:", itensParaAPI);

    if (itensParaAPI.length === 0) {
      setValidacao(null);
      return;
    }

    setLoadingValidacao(true);

    try {
      const res = await fetch(`${BASE_URL}/carrinho/validar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itensParaAPI),
      });

      const data = await res.json();

      // 🔹 Log do que vem do backend
      console.log("Resposta do backend:", data);

      if (!res.ok)
        throw new Error(data.message || "Erro ao validar o carrinho.");

      setValidacao(data);
    } catch (error) {
      console.error("Erro na validação da API:", error);
      setValidacao(null);
    } finally {
      setLoadingValidacao(false);
    }
  }, [carrinho]);

  const finalizarCompraAPI = useCallback(async () => {
    if (
      !validacao ||
      validacao.items.length === 0 ||
      validacao.validacao.erros.length > 0
    ) {
      alert("Não é possível finalizar a compra. Corrija os erros de estoque.");
      return;
    }

    const { valorTotal } = validacao.validacao;
    if (!window.confirm(`Confirmar compra de R$ ${valorTotal.toFixed(2)}?`)) {
      return;
    }

    const itensParaAPI = carrinho.map((item) => ({
      id: item.produtoId,
      quantidade: item.quantidadeDesejada,
      tipo: item.tipo,
    }));

    try {
      const res = await fetch(`${BASE_URL}/carrinho/comprar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itensParaAPI),
      });

      const data = await res.json();

      if (
        !res.ok ||
        (Array.isArray(data) && data[0].startsWith("Estoque insuficiente"))
      ) {
        alert(
          "Falha na compra:\n" +
            (data.message ||
              (Array.isArray(data) ? data.join("\n") : "Erro desconhecido"))
        );
        validarCarrinhoAPI();
        return;
      }

      alert(Array.isArray(data) ? data[0] : "Compra finalizada com sucesso!");
      limparCarrinho();
      setModalAberto(false);

      if (fetchCards) fetchCards();
    } catch (error) {
      alert("Erro ao finalizar a compra.");
      console.error("Erro de API na compra:", error);
    }
  }, [validacao, carrinho, limparCarrinho, validarCarrinhoAPI, fetchCards]);

  useEffect(() => {
    validarCarrinhoAPI();
  }, [validarCarrinhoAPI]);

  const totalItensCarrinho = useMemo(
    () => carrinho.reduce((total, item) => total + item.quantidadeDesejada, 0),
    [carrinho]
  );

  const value = useMemo(
    () => ({
      carrinho,
      validacao,
      modalAberto,
      loadingValidacao,
      totalItensCarrinho,
      abrirModal: () => setModalAberto(true),
      fecharModal: () => setModalAberto(false),
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      finalizarCompraAPI,
      validarCarrinhoAPI,
    }),
    [
      carrinho,
      validacao,
      modalAberto,
      loadingValidacao,
      totalItensCarrinho,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      finalizarCompraAPI,
      validarCarrinhoAPI,
    ]
  );

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
