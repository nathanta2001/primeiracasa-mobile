import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';


// interface para as props do componente
interface ConfirmDeleteDialogProps {
    visible: boolean;
    titulo?: string;
    mensagem?: string;
    labelConfirmar?: string;
    carregando?: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
}

export function ConfirmDeleteDialog({
    visible,
    titulo = 'Confirmar Exclusão',
    mensagem = 'Tem certeza que deseja excluir este item?',
    labelConfirmar = 'Excluir',
    carregando = false,
    onConfirm,
    onDismiss,
}: ConfirmDeleteDialogProps) {

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{titulo}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{mensagem}</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress={onDismiss} disabled={carregando}>
                        Cancelar
                    </Button>
                    <Button
                        mode="contained"
                        buttonColor="#dc2626"
                        onPress={onConfirm}
                        loading={carregando}
                        disabled={carregando}
                    >
                        {labelConfirmar}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
  actions: { gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
});