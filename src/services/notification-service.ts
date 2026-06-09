import { api } from './api';

export interface Notification {
    id: string;
    type: string;
    data: {
        message: string;
        loan_id: number;
        projector: string;
        user_name: string;
        ended_at: string;
        type: string;
    };
    read_at: string | null;
    created_at: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
};

export const markAsRead = async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
    await api.post('/notifications/mark-all-read');
};