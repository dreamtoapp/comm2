import Pusher from 'pusher-js';

// Ensure required environment variables are set
if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing required Pusher environment variables. Check .env file and ensure NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER are set.');
}

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

// import Pusher from 'pusher-js';

// export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
// });
