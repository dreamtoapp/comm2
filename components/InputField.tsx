import React from 'react';

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  labelSuffix?: React.ReactNode; // New prop for tooltip or other suffix
}

export default function InputField({
  name,
  label,
  error,
  required,
  labelSuffix, // Destructure new prop
  className,
  ...inputProps // all other standard <input> props
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className='flex items-center text-sm font-medium'> {/* Use flex for alignment */}
        <span>{label}</span> {/* Wrap label text in span for flex control */}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {labelSuffix && <span className="ml-1">{labelSuffix}</span>} {/* Render suffix */}
      </label>
      <input
        id={name}
        name={name}
        className={`
          mt-1 block w-full border px-3 py-2 rounded-md shadow-sm sm:text-sm
          focus:border-blue-500 focus:outline-none focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className || ''}
        `}
        {...inputProps}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

export function InputWithValidation({
  name,
  label,
  error,
  required, // Destructure required prop for InputWithValidation
  labelSuffix, // Also add to InputWithValidation if it's meant to be a general enhancement
  className,
  onInvalid,
  onInput,
  ...inputProps
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className='flex items-center text-sm font-medium'> {/* Use flex for alignment */}
        <span>{label}</span> {/* Wrap label text in span for flex control */}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {labelSuffix && <span className="ml-1">{labelSuffix}</span>} {/* Render suffix here too if applicable */}
      </label>
      <input
        id={name}
        name={name}
        className={`
          mt-1 block w-full border px-3 py-2 rounded-md shadow-sm sm:text-sm
          focus:border-blue-500 focus:outline-none focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className || ''}
        `}
        onInvalid={(e) => {
          if (error) {
            e.currentTarget.setCustomValidity(error);
          }
          onInvalid?.(e);
        }}
        onInput={(e) => {
          e.currentTarget.setCustomValidity('');
          onInput?.(e);
        }}
        {...inputProps}
      />
      {/* you can uncomment if you want inline error text */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
