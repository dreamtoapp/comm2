'use client';
import React from 'react';

interface DownloadDataButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
  buttonText?: string;
  className?: string;
}

// This component is a lightweight alternative to PDF export
const DownloadDataButton: React.FC<DownloadDataButtonProps> = ({
  buttonText = 'تصدير البيانات',
  className = '',
}) => {
  return (
    <button
      type='button'
      className={`cursor-not-allowed rounded-lg bg-gray-400 px-4 py-2 font-bold text-white opacity-60 shadow ${className}`}
      aria-label='تصدير البيانات'
      disabled
      title='ميزة تصدير البيانات غير مفعلة حالياً'
    >
      {buttonText}
    </button>
  );
};

export default DownloadDataButton;
