'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // Import Sonner for toast notifications
import { subscribeToNewsletter } from '../../../app/(e-comm)/homepage/actions/newsletter'; // Import the server action

const Newsletter = () => {
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true); // Set loading state

    try {
      // Call the Server Action
      const result = await subscribeToNewsletter(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Show success message
      toast.success('تم التسجيل بنجاح', {
        description: 'شكرًا لتسجيلك في النشرة الإخبارية!',
      });
    } catch (error) {
      // Show error message
      toast.error(error instanceof Error ? error.message : 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className='text-center sm:text-right'>
      <h3 className='mb-4 text-lg font-semibold'>سجل معنا</h3>
      <form action={handleSubmit} className='flex flex-col space-y-4'>
        <Input
          type='email'
          name='email'
          placeholder='سجل بريدك الالكتروني'
          className='w-full'
          aria-label='Email for newsletter subscription'
          disabled={isLoading} // Disable input while loading
        />
        <Button
          type='submit'
          className='w-full bg-primary transition-colors duration-300 hover:bg-primary/90'
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'جاري التسجيل...' : 'سجل معنا لتصلك اخر العروض'}
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
