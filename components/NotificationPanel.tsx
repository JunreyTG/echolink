import React from 'react';
import { Notification, NotificationType, User } from '../types';
import { BellIcon, CheckIcon, CloseIcon, UserPlusIcon } from './Icons';

interface NotificationPanelProps {
    notifications: Notification[];
    users: User[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNotificationAction: (id: string, action: 'accept' | 'decline') => void;
    onJoinLobby: (roomId: string) => void;
}

const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m`;
    return `now`;
};

const NotificationItem: React.FC<{ notification: Notification, sender?: User } & Omit<NotificationPanelProps, 'notifications' | 'users'>> =
({ notification, sender, onMarkAsRead, onNotificationAction, onJoinLobby }) => {
    if (!sender) return null;

    const renderContent = () => {
        switch(notification.type) {
            case NotificationType.FRIEND_REQUEST:
                return {
                    icon: <UserPlusIcon className="h-5 w-5 text-green-500" />,
                    message: <><span className="font-semibold">{sender.username}</span> sent you a friend request.</>,
                    actions: (
                        <div className="flex items-center space-x-2 mt-2">
                            <button onClick={() => onNotificationAction(notification.id, 'accept')} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-full text-green-500"><CheckIcon className="h-4 w-4" /></button>
                            <button onClick={() => onNotificationAction(notification.id, 'decline')} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-500"><CloseIcon className="h-4 w-4" /></button>
                        </div>
                    )
                };
            case NotificationType.LOBBY_INVITE:
                return {
                    icon: <BellIcon className="h-5 w-5 text-indigo-500" />,
                    message: <><span className="font-semibold">{sender.username}</span> invited you to <span className="font-semibold">{notification.data?.roomName}</span>.</>,
                    actions: <button onClick={() => onJoinLobby(notification.data!.roomId!)} className="mt-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md">Join</button>
                };
            case NotificationType.LFG_JOIN_REQUEST:
                 return {
                    icon: <UserPlusIcon className="h-5 w-5 text-blue-500" />,
                    message: <><span className="font-semibold">{sender.username}</span> wants to join your group for <span className="font-semibold">{notification.data?.postTitle}</span>.</>,
                    actions: (
                        <div className="flex items-center space-x-2 mt-2">
                            <button onClick={() => onNotificationAction(notification.id, 'accept')} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-full text-green-500"><CheckIcon className="h-4 w-4" /></button>
                            <button onClick={() => onNotificationAction(notification.id, 'decline')} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-500"><CloseIcon className="h-4 w-4" /></button>
                        </div>
                    )
                };
            case NotificationType.MENTION:
                 return {
                    icon: <div className="font-bold text-gray-500">@</div>,
                    message: <><span className="font-semibold">{sender.username}</span> mentioned you in <span className="font-semibold">#{notification.data?.roomName}</span>.</>,
                    actions: <button className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Go to message</button>
                };
            default:
                return { message: 'New notification.' };
        }
    }

    const { icon, message, actions } = renderContent();

    return (
        <button 
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
            className="w-full text-left p-3 flex items-start space-x-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
            {!notification.isRead && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 bg-green-500 rounded-full"></div>}
            <div className="flex-shrink-0 pt-1">{icon || <img src={sender.avatarUrl} alt={sender.username} className="h-8 w-8 rounded-full" />}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">{message}</p>
                {actions && <div onClick={e => e.stopPropagation()}>{actions}</div>}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{timeSince(notification.createdAt)}</div>
        </button>
    );
}

const NotificationPanel: React.FC<NotificationPanelProps> = (props) => {
    const { notifications, users, onClose, onMarkAllAsRead } = props;

    const unreadNotifications = notifications.filter(n => !n.isRead);
    const readNotifications = notifications.filter(n => n.isRead);
    
    return (
    <div className="fixed top-14 right-4 z-50 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="bg-white dark:bg-[#2f3136] rounded-lg shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[60vh]">
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadNotifications.length > 0 && (
                     <button onClick={onMarkAllAsRead} className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">Mark all as read</button>
                )}
            </header>
            
            <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                        <BellIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                        <p className="mt-2 font-semibold">No new notifications</p>
                        <p className="text-sm">Check back later!</p>
                    </div>
                ) : (
                    <>
                    {unreadNotifications.length > 0 && (
                        <div className="p-2">
                            <h4 className="px-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1">New</h4>
                            {unreadNotifications.map(n => <NotificationItem key={n.id} notification={n} sender={users.find(u => u.id === n.senderId)} {...props} />)}
                        </div>
                    )}
                     {readNotifications.length > 0 && (
                        <div className="p-2">
                            <h4 className="px-2 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-1">Earlier</h4>
                            {readNotifications.map(n => <NotificationItem key={n.id} notification={n} sender={users.find(u => u.id === n.senderId)} {...props} />)}
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default NotificationPanel;