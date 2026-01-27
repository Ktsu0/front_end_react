// hooks/useCarrinho.js

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  finalizarCompra as apiFinalizarCompra,
  validarCarrinho as apiValidarCarrinho,
} from "./../service/context/useCarrinho";
import StatusModal from "../components/loading/statusModal";

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children, fetchCards }) => {
  // 1. ESTADOS
  const [carrinho, setCarrinho] = useState(() => {
    const localData = localStorage.getItem("carrinho");
    return localData ? JSON.parse(localData) : [];
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [status, setStatus] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Persistência local do carrinho
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  // 🔥 SINCRONIZAÇÃO SILENCIOSA COM O BANCO
  // Busca os dados reais (estoque/preço) sem travar a tela
  const syncCart = useCallback(async (itensParaSincronizar) => {
    if (!itensParaSincronizar || itensParaSincronizar.length === 0) return;
    try {
      const data = await apiValidarCarrinho(itensParaSincronizar);
      if (data && data.items) {
        setCarrinho((prev) => {
          return data.items.map((apiItem) => {
            const itemLocal = prev.find(
              (li) => li.produtoId === apiItem.produtoId,
            );
            return {
              ...apiItem,
              // Mantemos a quantidade que o usuário escolheu, mas com dados reais do banco
              quantidadeDesejada: itemLocal
                ? itemLocal.quantidadeDesejada
                : apiItem.quantidadeDesejada,
            };
          });
        });
      }
    } catch (e) {
      console.warn("[Carrinho] Falha na sincronização silenciosa:", e.message);
    }
  }, []);

  // Sincronizar ao abrir o modal para garantir dados frescos
  useEffect(() => {
    if (modalAberto && carrinho.length > 0) {
      syncCart(carrinho);
    }
  }, [modalAberto, syncCart]);

  // Lógica: Limpar
  const limparCarrinho = useCallback(() => {
    setCarrinho([]);
  }, []);

  // Lógica: Remover item
  const removerDoCarrinho = useCallback((produtoId) => {
    setCarrinho((prev) => prev.filter((item) => item.produtoId !== produtoId));
  }, []);

  // Lógica: Atualizar quantidade (Sem validação instantânea no servidor)
  const atualizarQuantidade = useCallback(
    (produtoId, novaQuantidade) => {
      if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
      }

      setCarrinho((prev) =>
        prev.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidadeDesejada: novaQuantidade }
            : item,
        ),
      );
    },
    [removerDoCarrinho],
  );

  // Lógica: Adicionar item
  const adicionarAoCarrinho = useCallback(
    (cardData, quantidade = 1) => {
      let novaLista;
      setCarrinho((prevCarrinho) => {
        const itemExistente = prevCarrinho.find(
          (item) => item.produtoId === cardData.id,
        );

        if (itemExistente) {
          novaLista = prevCarrinho.map((item) =>
            item.produtoId === cardData.id
              ? {
                  ...item,
                  quantidadeDesejada: item.quantidadeDesejada + quantidade,
                }
              : item,
          );
        } else {
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
        return novaLista;
      });

      // 🔥 Sincroniza imediatamente após adicionar para pegar o estoque real
      syncCart(novaLista || [cardData]);
    },
    [syncCart],
  );

  // Cálculos locais (sem esperar backend)
  const stats = useMemo(() => {
    const totalItens = carrinho.reduce(
      (sum, i) => sum + i.quantidadeDesejada,
      0,
    );
    const valorTotal = carrinho.reduce(
      (sum, i) => sum + i.valorUnitario * i.quantidadeDesejada,
      0,
    );
    return { totalItens, valorTotal };
  }, [carrinho]);

  // Lógica: Chamada ao service de compra (Aqui o Prisma valida o estoque final)
  const handleFinalizarCompra = useCallback(async () => {
    if (carrinho.length === 0) return;

    if (
      !window.confirm(`Confirmar compra de R$ ${stats.valorTotal.toFixed(2)}?`)
    ) {
      return;
    }

    try {
      const data = await apiFinalizarCompra(carrinho);
      setStatus({
        show: true,
        message: Array.isArray(data) ? data[0] : "Compra realizada!",
        type: "success",
      });
      limparCarrinho();
      setModalAberto(false);
      if (fetchCards) fetchCards();
    } catch (error) {
      setStatus({
        show: true,
        message: error.message || "Erro no estoque. Tente novamente.",
        type: "error",
      });
      // Sincroniza em caso de erro para mostrar o estoque atualizado
      syncCart(carrinho);
    }
  }, [carrinho, stats, limparCarrinho, fetchCards, syncCart]);

  const value = useMemo(
    () => ({
      carrinho,
      modalAberto,
      totalItensCarrinho: stats.totalItens,
      totalValorCarrinho: stats.valorTotal,
      abrirModal: () => setModalAberto(true),
      fecharModal: () => setModalAberto(false),
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      finalizarCompra: handleFinalizarCompra,
      setStatus,
    }),
    [
      carrinho,
      modalAberto,
      stats,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      handleFinalizarCompra,
    ],
  );

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
      {status.show && (
        <StatusModal
          message={status.message}
          type={status.type}
          onClose={() => setStatus({ ...status, show: false })}
        />
      )}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
