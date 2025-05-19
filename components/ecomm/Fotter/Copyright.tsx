import React from 'react';
import packageJson from '../../../package.json'; // Import package.json
const Copyright = () => {
  return (
    <div className='mt-6 text-center text-sm text-muted-foreground'>
      {/* Copyright Notice */}
      <p>&copy; {new Date().getFullYear()} DTA All rights reserved.</p>

      {/* Developer Credit */}
      <p>
        Developed by{' '}
        <a
          href='https://dreamto.app'
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:underline'
        >
          DreamToApp
        </a>
      </p>

      {/* Version Number */}
      <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
        Version: {packageJson.version}
      </p>
    </div>
  );
};

export default Copyright;
