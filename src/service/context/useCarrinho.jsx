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
  // Estado principal do carrinho (itens no frontend)
  const [carrinho, setCarrinho] = useState([]);
  // Estado para controlar a abertura/fechamento do modal
  const [modalAberto, setModalAberto] = useState(false);
  // Estado para armazenar os dados validados (preços, totais, erros) da API
  const [validacao, setValidacao] = useState(null);
  const [loadingValidacao, setLoadingValidacao] = useState(false);

  // -----------------------------------------------------------
  // 1. Funções de Manipulação Local
  // -----------------------------------------------------------

  const adicionarAoCarrinho = useCallback((cardData, quantidade = 1) => {
    setCarrinho((prevCarrinho) => {
      const itemExistente = prevCarrinho.find(
        (item) => item.id === cardData.id
      );
      const estoqueDisponivel = cardData.estoque;

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade;

        if (novaQuantidade > estoqueDisponivel) {
          alert(
            `Não é possível adicionar mais. Limite de estoque é ${estoqueDisponivel} unidades.`
          );
          return prevCarrinho;
        }

        return prevCarrinho.map((item) =>
          item.id === cardData.id
            ? { ...item, quantidade: novaQuantidade }
            : item
        );
      } else {
        if (quantidade > estoqueDisponivel) {
          alert(
            `Não é possível adicionar. Limite de estoque é ${estoqueDisponivel} unidades.`
          );
          return prevCarrinho;
        }
        return [...prevCarrinho, { ...cardData, quantidade }];
      }
    });
  }, []);

  const removerDoCarrinho = useCallback((serieId) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter((item) => item.id !== serieId)
    );
  }, []);

  const atualizarQuantidade = useCallback(
    (serieId, novaQuantidade) => {
      if (novaQuantidade <= 0) {
        removerDoCarrinho(serieId);
        return;
      }

      setCarrinho((prevCarrinho) =>
        prevCarrinho.map((item) => {
          if (item.id === serieId) {
            const estoqueMaximo = item.estoque;
            return {
              ...item,
              quantidade: Math.min(novaQuantidade, estoqueMaximo),
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
  // 2. Comunicação com a API (Validação)
  // -----------------------------------------------------------

  const validarCarrinhoAPI = useCallback(async () => {
    const itensParaAPI = carrinho.map((item) => ({
      id: item.id,
      quantidade: item.quantidade,
    }));

    if (itensParaAPI.length === 0) {
      setValidacao(null);
      return;
    }

    setLoadingValidacao(true);

    try {
      // 🚀 Endpoint correto: /series/carrinho/validar
      const res = await fetch(`${BASE_URL}/series/carrinho/validar`, {
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
      // Mantém o estado de validação anterior ou define como nulo em caso de falha de conexão
      setValidacao(null);
    } finally {
      setLoadingValidacao(false);
    }
  }, [carrinho]); // Dependência: Roda sempre que o estado local do carrinho muda

  // -----------------------------------------------------------
  // 3. Comunicação com a API (Compra)
  // -----------------------------------------------------------

  /**
   * Finaliza a compra chamando o endpoint de transação no Backend.
   * 💡 Encapsulado em useCallback
   */
  const finalizarCompraAPI = useCallback(async () => {
    // Revalidação de segurança no Frontend:
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

    // Mapeia o carrinho para o formato da API
    const itensParaAPI = carrinho.map((item) => ({
      id: item.id,
      quantidade: item.quantidade,
    }));

    try {
      // 🚀 Endpoint correto: /series/carrinho/comprar
      const res = await fetch(`${BASE_URL}/series/carrinho/comprar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itensParaAPI),
      });

      const data = await res.json();

      // Verifica se houve falha de compra (código HTTP != 2xx ou mensagem de estoque)
      if (
        !res.ok ||
        (Array.isArray(data) && data[0].startsWith("Estoque insuficiente"))
      ) {
        alert(
          "Falha na compra:\n" +
            (data.message ||
              (Array.isArray(data) ? data.join("\n") : "Erro desconhecido"))
        );
        // Força nova validação para refletir o estoque atual após a tentativa de compra
        validarCarrinhoAPI();
        return;
      }

      // Sucesso na compra
      alert(Array.isArray(data) ? data[0] : "Compra finalizada com sucesso!");
      limparCarrinho(); // Limpa o estado local
      setModalAberto(false);

      // 💡 Se 'fetchCards' foi passado como prop para o Provider, execute-o:
      if (fetchCards) {
        fetchCards();
      }
    } catch (error) {
      alert("Erro ao finalizar a compra.");
      console.error("Erro de API na compra:", error);
    }
  }, [validacao, carrinho, limparCarrinho, validarCarrinhoAPI, fetchCards]);

  useEffect(() => {
    validarCarrinhoAPI();
  }, [validarCarrinhoAPI]);

  const totalItensCarrinho = useMemo(() => {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
  }, [carrinho]);

  const value = useMemo(
    () => ({
      carrinho,
      validacao,
      modalAberto,
      loadingValidacao,
      totalItensCarrinho,
      // Funções de UI
      abrirModal: () => setModalAberto(true),
      fecharModal: () => setModalAberto(false),
      // Funções de manipulação local
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      // Funções de API
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

// Hook para consumir o contexto
export const useCarrinho = () => useContext(CarrinhoContext);
