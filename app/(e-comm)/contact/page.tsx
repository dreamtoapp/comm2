'use client';
import React, { useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { submitContactForm } from './action/contact';

const ContactForm: React.FC = () => {
  const initialState = {
    success: false,
    message: '',
  };

  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.message) {
      // Use if/else instead of ternary for side effects
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
      if (state.success) {
        setSubmitted(true);
      }
    }
  }, [state]);

  return (
    <div className='mx-auto max-w-2xl rounded-lg border bg-background p-6 shadow-xl dark:border-gray-800'>
      <h1 className='mb-4 text-center text-3xl font-bold text-foreground'>تواصل معنا</h1>
      <p className='mb-6 text-center text-foreground'>
        نحن هنا لمساعدتك. يرجى ملء النموذج أدناه للتواصل معنا، وسنرد عليك في أقرب وقت ممكن.
      </p>
      {submitted ? (
        <div className='text-center' role='alert'>
          <h2 className='text-2xl font-bold text-green-600'>شكراً لتواصلك معنا!</h2>
          <p className='mt-2 text-foreground'>{state.message}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              if (formRef.current) {
                formRef.current.reset();
              }
            }}
            className='mt-4 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          >
            إرسال رسالة أخرى
          </button>
        </div>
      ) : (
        <form ref={formRef} action={formAction} className='space-y-4'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-foreground'>
              الاسم <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='أدخل اسمك'
              autoComplete='name'
              className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-foreground'>
              البريد الإلكتروني <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='أدخل بريدك الإلكتروني'
              autoComplete='email'
              className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          </div>

          <div>
            <label htmlFor='subject' className='block text-sm font-medium text-foreground'>
              الموضوع <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='subject'
              id='subject'
              placeholder='أدخل الموضوع'
              className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          </div>

          <div>
            <label htmlFor='message' className='block text-sm font-medium text-foreground'>
              الرسالة <span className='text-red-500'>*</span>
            </label>
            <textarea
              name='message'
              id='message'
              rows={5}
              placeholder='أدخل رسالتك'
              className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm transition-shadow duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform duration-200 hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <svg
                    className='mr-3 h-5 w-5 animate-spin text-primary-foreground'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z'
                    ></path>
                  </svg>
                  جاري الإرسال...
                </>
              ) : (
                'إرسال الرسالة'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
