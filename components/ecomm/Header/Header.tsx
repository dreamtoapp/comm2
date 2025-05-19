import { Session } from 'next-auth';


// import NavLinks from './NavLinks'; 
import HeaderClient from './HeaderClient';
// Header.tsx (Server Component)
import Logo from './Logo';
import SearchBar from './SearchBar';

interface HeaderProps {
  logo: string;
  logoAlt: string;
  session: Session | null;
}

export default function Header({ session, logo, logoAlt }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 bg-background/95 shadow-md backdrop-blur-md supports-[backdrop-filter]:bg-background/80 dark:shadow-lg dark:shadow-gray-800/50'>
      {/* Main Header Bar */}
      <div className='border-b border-border'>
        <nav
          className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'
          aria-label='Main header'
        >
          {/* Logo (centered on mobile, left on desktop) */}
          <div className='flex flex-shrink-0 items-center ml-2 md:ml-0'>
            <Logo logo={logo} logoAlt={logoAlt} />
          </div>

          {/* Search Bar - flexible and prominent */}
          <div className='flex flex-1 items-center justify-center px-2 md:px-6'>
            <div className='w-full max-w-xl'>
              <SearchBar />
            </div>
          </div>

          {/* Actions: Cart, User, etc. - grouped with spacing */}
          <div className='flex items-center gap-2 md:gap-3'>
            <HeaderClient session={session} />
          </div>
        </nav>
      </div>

      {/* Navigation Bar for Categories (Desktop) */}
      <div className='hidden border-b border-border bg-background shadow-sm md:block'>
        <nav
          className='mx-auto flex max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8'
          aria-label='Product categories'
        >
          {/* <CategoryNav /> */}
        </nav>
      </div>
    </header>
  );
}
