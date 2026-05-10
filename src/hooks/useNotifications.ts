import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldVibrate: true,
    }),
});

export function useNotifications() {
    useEffect(() => {
        solicitarPermisoNotificaciones();
    }, []);


    const solicitarPermisoNotificaciones = async () => {
        if (Platform.OS === 'android') {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync()
            }
        };
    }

    const agendarNotificacion = async (titulo: string, body: string) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: body,
                data: { data: 'dados extras' },
            },
            trigger: null,
        });
    }

    return { agendarNotificacion };
}
