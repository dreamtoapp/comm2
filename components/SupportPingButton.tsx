// components/SupportPingButton.tsx
// UI Button to ping admin with fallback logic, message modal, and cooldown timer
'use client';
import { useState, useRef, useEffect } from 'react';
import { Zap } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import { pingAdminAction } from '@/app/pingAdminAction';
// Removed Icon import: import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/button';

const COOLDOWN_SECONDS = 180; // 3 minutes
const LAST_PING_KEY = 'support_ping_last_time';

interface SupportPingButtonProps {
  userId: string;
}

/**
 * Button that triggers a support alert to the admin dashboard.
 * Uses a server action for real-time (Pusher) or fallback (DB) notification.
 */
export function SupportPingButton({ userId }: SupportPingButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error' | 'fallback' | 'rate-limited'>(
    'idle',
  );
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // On mount, restore cooldown from localStorage
  useEffect(() => {
    const lastPing = localStorage.getItem(LAST_PING_KEY);
    if (lastPing) {
      const elapsed = Math.floor((Date.now() - parseInt(lastPing, 10)) / 1000);
      if (elapsed < COOLDOWN_SECONDS) {
        setCooldown(COOLDOWN_SECONDS - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
  }, [cooldown]);

  // Handles the button click to ping admin
  const handlePing = async () => {
    setLoading(true);
    const res = await pingAdminAction(userId, message);
    setLoading(false);
    if (res.success) {
      setStatus('sent');
      setCooldown(COOLDOWN_SECONDS);
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    } else if (res.fallback) {
      setStatus('fallback');
      setCooldown(COOLDOWN_SECONDS);
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    } else if (res.rateLimited) {
      setStatus('rate-limited');
      setCooldown(COOLDOWN_SECONDS);
      localStorage.setItem(LAST_PING_KEY, Date.now().toString());
    } else setStatus('error');
    setShowModal(false);
    setMessage('');
  };

  return (
    <div>
      <Button
        variant='secondary'
        size='icon'
        className='support-ping-btn group relative h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200/70'
        onClick={() => setShowModal(true)}
        disabled={cooldown > 0}
        title='طلب دعم فوري من الإدارة'
        aria-label='زر طلب دعم فوري من الإدارة'
        tabIndex={0}
      >
        <span className='sr-only'>طلب دعم فوري</span>
        <Zap className={iconVariants({ variant: 'warning', size: 'lg', animation: 'pulse', className: 'drop-shadow' })} /> {/* Use direct import + CVA */}
        {cooldown > 0 && (
          <span
            className='absolute -right-2 -top-2 animate-pulse rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-blue-700 shadow'
            aria-live='polite'
          >
            {Math.floor(cooldown / 60)}:{(cooldown % 60).toString().padStart(2, '0')}
          </span>
        )}
      </Button>
      {status === 'sent' && <span className='ml-2 text-green-600'>Alert sent!</span>}
      {status === 'fallback' && (
        <span className='ml-2 text-yellow-600'>
          Admin will see your request soon (fallback mode).
        </span>
      )}
      {status === 'rate-limited' && (
        <span className='ml-2 text-orange-600'>Please wait before sending another ping.</span>
      )}
      {status === 'error' && (
        <span className='ml-2 text-red-600'>Failed to send alert. Try again.</span>
      )}
      {/* Modal for entering message */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='flex w-full max-w-xs flex-col gap-3 rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='text-lg font-semibold'>وصف مشكلتك</h3>
            <p className='mb-1 text-xs text-gray-700'>
              <span className='mb-0.5 block'>
                الغرض من هذه الخدمة: إرسال طلب دعم فوري للإدارة لحل مشكلة عاجلة أو استفسار هام.
              </span>
              <span className='block'>عدد الأحرف المسموح: من 5 إلى 200 حرف.</span>
              <span className='block'>
                يرجى استخدام هذه الخدمة فقط للمشاكل العاجلة أو الاستفسارات الهامة.
              </span>
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={3}
              className='w-full resize-none rounded border p-2'
              placeholder='كيف يمكننا مساعدتك؟'
              autoFocus
            />
            <div className='flex justify-end gap-2'>
              <button
                className='rounded bg-gray-200 px-3 py-1 hover:bg-gray-300'
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                className='rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-60'
                onClick={handlePing}
                disabled={loading || message.trim().length < 5}
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
