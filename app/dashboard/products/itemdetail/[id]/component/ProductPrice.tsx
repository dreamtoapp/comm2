import { Tag } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';

interface ProductPriceProps {
  price: number;
  isEditing?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Displays the product price, editable if isEditing is true
const ProductPrice: React.FC<ProductPriceProps> = ({ price, isEditing, value, onChange }) => (
  <div className='flex flex-col gap-2 rounded-xl border border-border bg-card p-4'>
    <div className='mb-1 flex items-center gap-2'>
      <Tag className={iconVariants({ size: 'sm', className: 'shrink-0 text-primary' })} /> {/* Use direct import + CVA */}
      <h3 className='text-base font-semibold text-foreground md:text-lg'>السعر</h3>
    </div>
    {isEditing ? (
      <input
        type='number'
        value={value}
        onChange={onChange}
        placeholder='السعر'
        className='w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary'
      />
    ) : (
      <div className='flex items-center justify-between'>
        <span className='text-sm text-muted-foreground md:text-base'>السعر</span>
        <span className='text-xl font-bold text-primary md:text-2xl'>${price.toFixed(2)}</span>
      </div>
    )}
  </div>
);

export default ProductPrice;
