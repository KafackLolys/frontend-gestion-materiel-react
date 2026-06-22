// components/NotificationBell.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell, HiOutlineBellAlert } from 'react-icons/hi2';
import { useNotifications } from '@/hooks/use-notifications';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NotificationBell = () => {
    const navigate = useNavigate();
    const { data: user } = useUser();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (user?.role === 'student_delegate') {
            navigate('/dashboard');
        } else if (notification.data.loan_id) {
            navigate(`/dashboard/manager/loans/${notification.data.loan_id}`);
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {unreadCount > 0 ? (
                        <>
                            <HiOutlineBellAlert className="w-5 h-5 text-red-500" />
                            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                        </>
                    ) : (
                        <HiOutlineBell className="w-5 h-5" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-3 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAllAsRead()}
                                className="text-xs text-blue-600"
                            >
                                Tout marquer comme lu
                            </Button>
                        )}
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition ${
                                    !notification.read_at ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            {notification.data.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                    {!notification.read_at && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};