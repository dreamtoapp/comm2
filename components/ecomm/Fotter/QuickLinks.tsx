import { Store, Users, Phone } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Correct import path for CVA variants
import Link from '@/components/link';

const QuickLinks = () => {
  const links = [
    {
      name: 'المتجر',
      href: '/',
      icon: <Store className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />, // Use direct import + CVA
    },
    {
      name: 'من نحن',
      href: '/about',
      icon: <Users className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />, // Use direct import + CVA
    },
    {
      name: 'تواصل معنا',
      href: '/contact',
      icon: <Phone className={iconVariants({ size: 'xs', className: 'mr-2 inline-block' })} />, // Use direct import + CVA
    },
  ];

  return (
    <div className='text-center sm:text-right'>
      <h3 className='mb-4 text-lg font-semibold'>روابط</h3>
      <ul className='space-y-2 text-sm'>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className='flex items-center gap-2 transition-colors duration-300 hover:text-primary'
              aria-label={link.name}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
