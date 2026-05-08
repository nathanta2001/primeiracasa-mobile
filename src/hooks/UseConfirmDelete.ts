import { useCallback, useState } from "react";


interface UseConfirmDeleteReturn<T> {
    dialogProps:
    {
        visible: boolean;
        titulo?: string;
        mensagem?: string;
        labelConfirmar?: string;
        carregando?: boolean;
        onConfirm: () => void;
        onDismiss: () => void;
    };
    confirmarDelecao: (item: T) => void;
}

export function useConfirmDelete<T>(
    onDelete: (item: T) => void,
    options?: { carregando?: boolean }
): UseConfirmDeleteReturn<T> {
    const [visible, setVisible] = useState(false);
    const [itemPendente, setItemPendente] = useState<T | null>(null);

    const confirmarDelecao = useCallback((item: T) => {
        setItemPendente(item);
        setVisible(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (itemPendente !== null) {
            onDelete(itemPendente);
        }
        setVisible(false);
        setItemPendente(null);
    }, [itemPendente, onDelete]);

    const handleDismiss = useCallback(() => {
        setVisible(false);
        setItemPendente(null);
    }, []);

    return {
        dialogProps: {
            visible,
            carregando: options?.carregando ?? false,
            onConfirm: handleConfirm,
            onDismiss: handleDismiss,
        },
        confirmarDelecao,
    };
}