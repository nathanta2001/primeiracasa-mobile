import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';


// interface para as opções do hook
interface UseImagePickerOptions {
    quality?: number; // Qualidade da imagem (0 a 1)
    onImageSelected?: (base64: string) => void; // Callback quando uma imagem é selecionada
}

interface UseImagePickerReturn {
    fotoBase64: string | null; // Base64 da imagem selecionada
    setFotoBase64: (base64: string | null) => void; // Função para atualizar o Base64
    capturaFoto: () => Promise<void>; // Função para capturar uma foto
    escolherImagem: () => Promise<void>; // Função para escolher uma imagem da galeria
    limparImagem: () => void; // Função para limpar a imagem selecionada
    temFoto: boolean; // Indica se uma foto foi selecionada
}

export function useImagePicker(options: UseImagePickerOptions = {}): UseImagePickerReturn {

    // qualidade da imagem, padrão é 0.5
    const { quality = 0.5, onImageSelected } = options;

    // estado para armazenar o Base64 da imagem selecionada
    const [fotoBase64, setFotoBase64] = useState<string | null>(null);

    // função para capturar uma foto usando a câmera
    const solicitarPermissaoCamera = async (): Promise<boolean> => {
        // solicita permissão para acessar a câmera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        // verifica se a permissão foi concedida
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir o acesso à câmera');
            return false;
        }
        return true;
    }

    // função para solicitar permissão de acesso à galeria
    const solicitarPermissaoGaleria = async (): Promise<boolean> => {
        // solicita permissão para acessar a galeria
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // verifica se a permissão foi concedida
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'É necessário permitir o acesso à galeria');
            return false;
        }
        return true;
    }

    // função para capturar uma foto usando a câmera
    const capturaFoto = useCallback(async () => {
        // solicita permissão para acessar a câmera
        const temPermissao = await solicitarPermissaoCamera();
        if (!temPermissao) return;

        // abre a câmera para capturar uma foto
        const resultado = await ImagePicker.launchCameraAsync({
            quality,
            base64: true,
            allowsEditing: true,
        });

        // verifica se o usuário cancelou a captura
        if (!resultado.canceled && resultado.assets[0].base64) {
            const base64 = resultado.assets[0].base64;
            setFotoBase64(base64);
            onImageSelected?.(base64);
        }
    }, [quality, onImageSelected]);

    // função para escolher uma imagem da galeria
    const escolherImagem = useCallback(async () => {
        // solicita permissão para acessar a galeria
        const temPermissao = await solicitarPermissaoGaleria();
        if (!temPermissao) return;

        // abre a galeria para escolher uma imagem
        const resultado = await ImagePicker.launchImageLibraryAsync({
            quality,
            base64: true,
            allowsEditing: true,
            mediaTypes: ['images'], // permite apenas imagens
        });

        // verifica se o usuário cancelou a seleção
        if (!resultado.canceled && resultado.assets[0].base64) {
            const base64 = resultado.assets[0].base64;
            setFotoBase64(base64);
            onImageSelected?.(base64);
        }
    }, [quality, onImageSelected]);

    // função para limpar a imagem selecionada
    const limparImagem = useCallback(() => {
        setFotoBase64(null);
    }, []);

    return {
        fotoBase64,
        setFotoBase64,
        capturaFoto,
        escolherImagem,
        limparImagem,
        temFoto: fotoBase64 !== null, // indica se uma foto foi selecionada
    };


}
