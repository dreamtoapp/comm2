import Fotter from '../../components/ecomm/Fotter/Fotter';
import Header from '../../components/ecomm/Header/Header';
// app/(ecommerce)/layout.tsx
import { TooltipProvider } from '../../components/ui/tooltip';
import getSession from '../../lib/getSession';
import { CartProvider } from '../../providers/cart-provider';
import { companyInfo } from './homepage/actions/companyDetail';

export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const companyData = await companyInfo();
  // const session = await auth()
  const session = await getSession();

  return (
    <TooltipProvider>
      <CartProvider>
        {/* Header is shared across all e-commerce pages */}
        <Header
          session={session}
          logo={companyData?.logo || ''}
          logoAlt={companyData?.fullName || 'Dream to app'}
        />
        <main className='container mx-auto min-h-screen p-4'>{children}</main>
        <Fotter
          companyName={companyData?.fullName}
          aboutus={companyData?.bio}
          email={companyData?.email}
          phone={companyData?.phoneNumber}
          address={companyData?.address}
          latitude={companyData?.latitude}
          longitude={companyData?.longitude}
          facebook={companyData?.facebook}
          instagram={companyData?.instagram}
          twitter={companyData?.twitter}
          linkedin={companyData?.linkedin}
          whatsapp={companyData?.whatsappNumber}
        />
      </CartProvider>
    </TooltipProvider>
  );
}
