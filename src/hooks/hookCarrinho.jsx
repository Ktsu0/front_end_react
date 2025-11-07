// hooks/useCarrinho.js

import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  validarCarrinho,
  finalizarCompra,
} from "./../service/context/useCarrinho";

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children, fetchCards }) => {
  // 1. ESTADOS
  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [validacao, setValidacao] = useState(null);
  const [loadingValidacao, setLoadingValidacao] = useState(false);

  // 2. FUNÇÕES DE LÓGICA E INTEGRAÇÃO COM SERVICE

  // Lógica: Chamada ao service de validação
  const handleValidarCarrinho = useCallback(async (itensParaValidar) => {
    // Se a lista estiver vazia, apenas limpa a validação
    if (itensParaValidar.length === 0) {
      setValidacao(null);
      return;
    }

    setLoadingValidacao(true);
    try {
      const data = await validarCarrinho(itensParaValidar);
      setValidacao(data);
    } catch (error) {
      console.error("Erro na validação do carrinho:", error);
      setValidacao(null);
    } finally {
      setLoadingValidacao(false);
    }
  }, []);

  // Lógica: Limpar e revalidar
  const limparCarrinho = useCallback(() => {
    setCarrinho([]);
    setValidacao(null);
    handleValidarCarrinho([]); // Revalida (limpa)
  }, [handleValidarCarrinho]);

  // Lógica: Remover item
  const removerDoCarrinho = useCallback(
    (produtoId) => {
      setCarrinho((prevCarrinho) => {
        const novaLista = prevCarrinho.filter(
          (item) => item.produtoId !== produtoId
        );
        handleValidarCarrinho(novaLista); // Revalida
        return novaLista;
      });
    },
    [handleValidarCarrinho]
  );

  // Lógica: Atualizar quantidade
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
        handleValidarCarrinho(novaLista); // Revalida
        return novaLista;
      });
    },
    [removerDoCarrinho, handleValidarCarrinho]
  );

  // Lógica: Adicionar item
  const adicionarAoCarrinho = useCallback(
    (cardData, quantidade = 1) => {
      // (Mantive a lógica interna de estoque e alertas aqui, pois é lógica de negócio)
      setCarrinho((prevCarrinho) => {
        let novaLista;

        const itemExistente = prevCarrinho.find(
          (item) => item.produtoId === cardData.id
        );

        // --- Lógica de estoque e adição ---
        if (itemExistente) {
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
        // --- Fim da lógica de estoque e adição ---

        handleValidarCarrinho(novaLista); // Revalida
        return novaLista;
      });
    },
    [handleValidarCarrinho]
  );

  // Lógica: Chamada ao service de compra
  const handleFinalizarCompra = useCallback(async () => {
    // Lógica de pré-validação antes da chamada à API
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

    try {
      const data = await finalizarCompra(carrinho); // ⬅️ Chama o service
      alert(Array.isArray(data) ? data[0] : "Compra finalizada com sucesso!");
      limparCarrinho();
      setModalAberto(false);

      if (fetchCards) fetchCards();
    } catch (error) {
      alert("Erro ao finalizar a compra. Tente novamente.");
      console.error("Erro de API na compra:", error);
      handleValidarCarrinho(carrinho); // Força revalidação para mostrar erros de estoque
    }
  }, [validacao, carrinho, limparCarrinho, handleValidarCarrinho, fetchCards]);

  // Lógica: Cálculo
  const totalItensCarrinho = useMemo(
    () => carrinho.reduce((total, item) => total + item.quantidadeDesejada, 0),
    [carrinho]
  );

  // 3. CONTEXTO E HOOK DE CONSUMO

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
      finalizarCompra: handleFinalizarCompra, // Expõe a função do hook
      validarCarrinho: () => handleValidarCarrinho(carrinho), // Força revalidação do estado atual
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
      handleFinalizarCompra,
      handleValidarCarrinho,
    ]
  );

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
