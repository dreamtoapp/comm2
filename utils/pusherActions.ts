'use server';
import Pusher from 'pusher';
import { revalidatePath } from 'next/cache';
import uniqeId from './uniqeId';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function submitForm(formData: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  type: 'message' | 'order';
}) {
  const newSubmission = {
    id: uniqeId(),
    type: formData.type, // "message" أو "order"
    name: formData.name,
    email: formData.email,
    subject: formData.subject || '',
    message: formData.message,
    createdAt: new Date().toISOString(),
  };

  // Ensure the correct channel and event are used
  await pusher.trigger('dashboard-updates', 'new-order', newSubmission);

  // Revalidate the dashboard path
  revalidatePath('/dashboard');

  return { success: true };
}
