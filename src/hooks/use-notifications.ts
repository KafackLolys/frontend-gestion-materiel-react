import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead } from '@/services/notification-service';
import echo from '@/services/echo';
import { toast } from 'react-hot-toast';

type NotificationBroadcast = {
    message: string;
};

export const useNotifications = () => {
    const queryClient = useQueryClient();
    const [unreadCount, setUnreadCount] = useState(0);

    const { data: notifications = [], refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        staleTime: 30 * 1000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    useEffect(() => {
        const count = notifications.filter((n) => !n.read_at).length;
        setUnreadCount(count);
    }, [notifications]);

    // Écouter les événements WebSocket

    useEffect(() => {
        if (!echo) return;

        try {
            echo.channel('notifications').listen('.new-loan-request', (data: NotificationBroadcast) => {
                toast.success(data.message);
                refetch();
            });
            echo.channel('notifications').listen('.loan-approved', (data: NotificationBroadcast) => {
                toast.success(data.message);
                refetch();
            });
            echo.channel('notifications').listen('.loan-returned', (data: NotificationBroadcast) => {
                toast.success(data.message);
                refetch();
            });
        } catch (error) {
            console.error('WebSocket subscription error:', error);
        }

        return () => {
            try {
                echo.leaveChannel('notifications');
            } catch (error) {
                console.error('Error leaving channel:', error);
            }
        };
    }, [refetch]);

    return {
        notifications,
        unreadCount,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        refetch,
    };
};