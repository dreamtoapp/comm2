// NotificationList.tsx
// Notification dialog for admin dashboard

import React from 'react';
import { Bell, Package, Mail, Newspaper } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';

export type NotificationType = {
  id: string;
  message: string;
  type?: string;
  userId?: string;
  createdAt: Date;
  read?: boolean;
  link?: string;
};

interface NotificationListProps {
  notifications: NotificationType[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const iconMap = {
  support: <Bell className={iconVariants({ size: 'sm', className: 'text-blue-400' })} />, // Use direct import + CVA
  order: <Package className={iconVariants({ size: 'sm', className: 'text-green-500' })} />, // Use direct import + CVA
  contact: <Mail className={iconVariants({ size: 'sm', className: 'text-blue-500' })} />, // Use direct import + CVA
  news: <Newspaper className={iconVariants({ size: 'sm', className: 'text-yellow-500' })} />, // Use direct import + CVA
  default: <Bell className={iconVariants({ size: 'sm', className: 'text-gray-500' })} />, // Use direct import + CVA
};

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkRead,
  onClose,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full max-w-2xl' dir='rtl'>
        <DialogHeader>
          <DialogTitle className='text-center text-lg font-bold'>الإشعارات</DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] divide-y overflow-y-auto overflow-x-hidden'>
          {notifications.length === 0 ? (
            <div className='whitespace-nowrap py-8 text-center text-base text-gray-400'>
              لا توجد إشعارات جديدة
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-gray-50 ${notif.read ? 'opacity-60' : 'bg-yellow-50'}`}
                onClick={() => onMarkRead(notif.id)}
              >
                <div className='pt-1'>
                  {iconMap[notif.type as keyof typeof iconMap] || iconMap.default}
                </div>
                <div className='flex-1'>
                  <div className='text-sm font-medium text-gray-900'>{notif.message}</div>
                  {notif.userId && (
                    <div className='text-xs text-gray-500'>User: {notif.userId}</div>
                  )}
                  <div className='mt-1 text-xs text-gray-400'>
                    {notif.createdAt.toLocaleString('ar-EG')}
                  </div>
                </div>
                {!notif.read && <span className='mt-2 h-2 w-2 rounded-full bg-red-500'></span>}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationList;
