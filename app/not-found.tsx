import Link from '@/components/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center font-sans'>
      <div className='relative max-w-2xl overflow-hidden rounded-2xl bg-white/95 p-12 shadow-xl'>
        {/* Decorative circle */}
        <div className='absolute -right-12 -top-12 h-48 w-48 rounded-full bg-red-500/10' />

        {/* Animated X icon */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          className='mx-auto h-32 w-32 animate-bounce-slow text-red-500 drop-shadow-[0_4px_8px_rgba(255,107,107,0.3)] filter'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='15' y1='9' x2='9' y2='15' />
          <line x1='9' y1='9' x2='15' y2='15' />
        </svg>

        {/* Content */}
        <h2 className='my-8 text-4xl font-bold tracking-tight text-gray-800'>
          404 - الصفحة غير موجودة
        </h2>

        <p className='mx-auto mb-8 max-w-md text-lg leading-relaxed text-gray-600'>
          عذرًا، يبدو أن الصفحة التي تبحث عنها قد أُزيلت أو غير موجودة
        </p>

        {/* Home button */}
        <Link
          href='/'
          className='inline-flex items-center rounded-full bg-red-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:shadow-xl'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='ml-2'
          >
            <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
            <polyline points='9 22 9 12 15 12 15 22' />
          </svg>
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
