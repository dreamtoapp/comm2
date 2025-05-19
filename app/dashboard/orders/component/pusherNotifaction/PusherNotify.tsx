'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Bell, Mail, Newspaper, Package, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

// import { pusherClient } from '@/lib/pusherSetting';
import { pusherClient } from '@/lib/pusherClient';
import { cn } from '@/lib/utils';

import { Button } from '../../../../../components/ui/button';
import { fetchNotifications } from './fetchNotifications';
import NotificationList, { NotificationType } from './NotificationList';

export default function PusherNotify() {
  const [msgCounter, setMsgCounter] = useState(0);
  const [notifications, setNotifications] = useState<NotificationType[]>([]); // Store notification objects
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const channelRef = useRef(pusherClient.subscribe('admin'));
  const hasInteracted = useRef(false);
  const isAudioEnabledRef = useRef(isAudioEnabled);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications and unread count from DB on mount and when dialog opens
  useEffect(() => {
    async function fetchFromDB() {
      const { notifications, unreadCount } = await fetchNotifications();
      setNotifications(notifications);
      setMsgCounter(unreadCount);
    }
    fetchFromDB();
  }, []);

  useEffect(() => {
    if (isOpen) {
      async function fetchOnOpen() {
        const { notifications, unreadCount } = await fetchNotifications();
        setNotifications(notifications);
        setMsgCounter(unreadCount);
      }
      fetchOnOpen();
    }
  }, [isOpen]);

  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  useEffect(() => {
    const audio = new Audio('/notification.mp3');
    audioRef.current = audio;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = useCallback(async () => {
    const newState = !isAudioEnabled;
    setIsAudioEnabled(newState);
    if (newState && !hasInteracted.current) {
      try {
        await audioRef.current?.play();
        audioRef.current?.pause();
        hasInteracted.current = true;
      } catch (err) {
        console.error('Audio initialization failed:', err);
        toast.error('Click to enable audio');
        setIsAudioEnabled(false);
      }
    }
  }, [isAudioEnabled]);

  // Add notification to list and show toast
  const handleNewOrder = useCallback(
    (data: { message: string; type?: string; userId?: string }) => {
      setMsgCounter((prev) => prev + 1);
      setNotifications((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          message: data.message,
          type: data.type,
          userId: data.userId,
          createdAt: new Date(),
          read: false,
          link: undefined, // Add deep-link if available
        },
        ...prev.slice(0, 49), // keep max 50
      ]);
      if (isAudioEnabledRef.current && hasInteracted.current && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      // Toast logic unchanged
      const { icon, bgColor } = (() => {
        switch (data.type) {
          case 'support':
            return {
              icon: <Bell className='h-4 w-4 animate-bounce text-blue-400' />, // Differentiate visually
              bgColor: 'bg-gradient-to-r from-blue-500 to-blue-700',
            };
          case 'order':
            return {
              icon: <Package className='h-4 w-4 animate-bounce' />,
              bgColor: 'bg-gradient-to-r from-green-500 to-green-700',
            };
          case 'contact':
            return {
              icon: <Mail className='h-4 w-4 animate-bounce' />,
              bgColor: 'bg-gradient-to-r from-blue-500 to-blue-700',
            };
          case 'news':
            return {
              icon: <Newspaper className='h-4 w-4 animate-bounce' />,
              bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
            };
          default:
            return {
              icon: <Bell className='h-4 w-4 animate-bounce' />,
              bgColor: 'bg-gradient-to-r from-gray-500 to-gray-700',
            };
        }
      })();
      toast.success(
        <div className='flex flex-col items-start gap-1'>
          <div className='flex items-center gap-2'>
            {icon}
            <span className='text-sm font-medium text-white'>{data.message}</span>
          </div>
          {data.userId && <span className='text-xs text-gray-200'>User: {data.userId}</span>}
        </div>,
        {
          duration: 5000,
          position: 'top-right',
          className: `border-0 shadow-lg ${bgColor}`,
        },
      );
    },
    [],
  );

  useEffect(() => {
    const channel = channelRef.current;
    channel.bind('new-order', handleNewOrder);
    channel.bind('support-alert', handleNewOrder); // Listen for support pings
    return () => {
      channel.unbind('new-order', handleNewOrder);
      channel.unbind('support-alert', handleNewOrder); // Cleanup
      pusherClient.unsubscribe('admin');
    };
  }, [handleNewOrder]);

  // Mark notification as read
  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setMsgCounter((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className='relative flex items-center gap-3'>
      {/* Audio Toggle */}
      <Button
        aria-label={isAudioEnabled ? 'Mute notifications' : 'Unmute notifications'}
        onClick={toggleAudio}
        size='icon'
        className={cn(
          'relative h-8 w-8 rounded-full transition-all',
          'bg-gradient-to-br hover:scale-105',
          isAudioEnabled
            ? 'from-green-400 to-teal-500 hover:shadow-green-400/30'
            : 'from-red-400 to-pink-500 hover:shadow-red-400/30',
          'shadow-lg hover:shadow-md',
        )}
      >
        {isAudioEnabled ? (
          <Volume2 className='h-5 w-5 animate-fade-in' />
        ) : (
          <VolumeX className='h-5 w-5 animate-fade-in' />
        )}
        <div className='absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-gray-200 bg-white' />
      </Button>

      {/* Notification Center Dialog */}
      <NotificationList
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />

      {/* Notifications Bell */}
      <Button
        aria-label='Notifications'
        size='icon'
        className={cn(
          'relative h-8 w-8 rounded-full transition-all',
          'bg-gradient-to-br from-purple-500 to-pink-500',
          'hover:scale-105 hover:from-purple-600 hover:to-pink-600',
          'shadow-lg hover:shadow-purple-400/30',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className='h-5 w-5' />
        {msgCounter > 0 && (
          <span
            className={cn(
              'absolute -right-1 -top-1 bg-red-500 text-xs text-white',
              'flex h-5 w-5 items-center justify-center rounded-full font-bold',
              'animate-ping-once',
            )}
          >
            {Math.min(msgCounter, 99)}
            {msgCounter > 99 && '+'}
          </span>
        )}
      </Button>
    </div>
  );
}
