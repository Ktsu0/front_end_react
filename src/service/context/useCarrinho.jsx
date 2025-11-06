import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:5000";
const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children, fetchCards }) => {
  // 1. ESTADOS
  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [validacao, setValidacao] = useState(null);
  const [loadingValidacao, setLoadingValidacao] = useState(false); // ----------------------------------------------------------- // 2. Comunicação com API (validarCarrinhoAPI) // ----------------------------------------------------------- // 💡 Esta função não usa estados do componente em seu corpo

  const validarCarrinhoAPI = useCallback(async (itensParaValidar) => {
    const itensParaAPI = itensParaValidar.map((item) => ({
      id: item.produtoId,
      quantidade: item.quantidadeDesejada,
      tipo: item.tipo,
    }));

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

      if (!res.ok)
        throw new Error(data.message || "Erro ao validar o carrinho.");

      setValidacao(data);
    } catch (error) {
      console.error("Erro na validação da API:", error);
      setValidacao(null);
    } finally {
      setLoadingValidacao(false);
    }
  }, []); // ----------------------------------------------------------- // 3. Funções de Manipulação Local // ----------------------------------------------------------- // 💡 Mover esta função para cá resolve o erro de referência na finalizarCompraAPI

  const limparCarrinho = useCallback(() => {
    setCarrinho([]);
    setValidacao(null);
    validarCarrinhoAPI([]);
  }, [validarCarrinhoAPI]);

  const removerDoCarrinho = useCallback(
    (produtoId) => {
      setCarrinho((prevCarrinho) => {
        const novaLista = prevCarrinho.filter(
          (item) => item.produtoId !== produtoId
        );
        validarCarrinhoAPI(novaLista);
        return novaLista;
      });
    },
    [validarCarrinhoAPI]
  );

  const atualizarQuantidade = useCallback(
    (produtoId, novaQuantidade) => {
      if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
      }

      setCarrinho((prevCarrinho) => {
        const novaLista = prevCarrinho.map((item) => {
          if (item.produtoId === produtoId) {
            const estoqueMaximo = item.estoqueDisponivel;
            return {
              ...item,
              quantidadeDesejada: Math.min(novaQuantidade, estoqueMaximo),
            };
          }
          return item;
        });
        validarCarrinhoAPI(novaLista);
        return novaLista;
      });
    },
    [removerDoCarrinho, validarCarrinhoAPI]
  );
  const adicionarAoCarrinho = useCallback(
    (cardData, quantidade = 1) => {
      setCarrinho((prevCarrinho) => {
        let novaLista;

        const itemExistente = prevCarrinho.find(
          (item) => item.produtoId === cardData.id
        );

        if (itemExistente) {
          // Lógica de atualização
          const novaQuantidade = itemExistente.quantidadeDesejada + quantidade;

          if (novaQuantidade > cardData.estoque) {
            alert(
              `Não é possível adicionar mais. Limite de estoque é ${cardData.estoque} unidades.`
            );
            return prevCarrinho;
          }

          novaLista = prevCarrinho.map((item) =>
            item.produtoId === cardData.id
              ? { ...item, quantidadeDesejada: novaQuantidade }
              : item
          );
        } else {
          // Lógica de adição
          if (quantidade > cardData.estoque) {
            alert(
              `Não é possível adicionar. Limite de estoque é ${cardData.estoque} unidades.`
            );
            return prevCarrinho;
          }
          novaLista = [
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

        validarCarrinhoAPI(novaLista);
        return novaLista;
      });
    },
    [validarCarrinhoAPI]
  ); // ----------------------------------------------------------- // 4. Comunicação com API (finalizarCompraAPI - AGORA USA limparCarrinho DEFINIDA) // -----------------------------------------------------------

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
        validarCarrinhoAPI(carrinho); // Chama validação manual
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
  }, [validacao, carrinho, limparCarrinho, validarCarrinhoAPI, fetchCards]); // ----------------------------------------------------------- // 5. UseMemo e Exports // -----------------------------------------------------------

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
      validarCarrinhoAPI: () => validarCarrinhoAPI(carrinho), // Expõe uma função que usa o estado atual
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
      {children}{" "}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
