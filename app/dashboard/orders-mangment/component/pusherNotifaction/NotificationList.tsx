// Stub for NotificationList component and NotificationType
import React from 'react';

export type NotificationType = {
  id: string;
  message: string;
};

type NotificationListProps = {
  notifications: NotificationType[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
};

export default function NotificationList({
  notifications,
  onClose,
}: NotificationListProps) {
  return (
    <div>
      NotificationList placeholder ({notifications.length} notifications)
      <button onClick={onClose}>Close</button>
    </div>
  );
}
