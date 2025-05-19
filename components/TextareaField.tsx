import React from 'react';

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  error?: string;
  required?: boolean; // Add required prop
}

export default function TextareaField({
  name,
  label,
  error,
  required, // Destructure required prop
  className,
  ...textareaProps // all other standard <textarea> props
}: TextareaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium'>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>} {/* Add asterisk if required */}
      </label>
      <textarea
        id={name}
        name={name}
        className={`
          mt-1 block w-full border px-3 py-2 rounded-md shadow-sm sm:text-sm
          focus:border-blue-500 focus:outline-none focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className || ''}
        `}
        {...textareaProps}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
