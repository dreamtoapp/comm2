'use client'; // Mark as a Client Component

import { useEffect, useState } from 'react';

import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

export default function WhatsAppButton({ whatsapp }: { whatsapp?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the user is on a mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
  }, []);

  // WhatsApp link with a welcome message
  const phoneNumber = whatsapp; // Replace with your WhatsApp number
  const welcomeMessage = 'Hello! I need help with my order.'; // Replace with your welcome message
  const whatsappLink = isMobile
    ? `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(welcomeMessage)}`
    : `https://wa.me/${phoneNumber}?text=${encodeURIComponent(welcomeMessage)}`;

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <a
        href={whatsappLink}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center justify-center rounded-full bg-green-500 p-4 text-white shadow-lg transition-colors hover:bg-green-600'
      >
        <FaWhatsapp className='h-8 w-8' /> {/* WhatsApp icon */}
      </a>
    </div>
  );
}
