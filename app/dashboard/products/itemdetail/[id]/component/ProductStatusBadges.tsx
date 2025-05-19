import { Badge } from '@/components/ui/badge';

interface ProductStatusBadgesProps {
  published: boolean;
  outOfStock: boolean;
}

// Shows status badges for published and stock status
const ProductStatusBadges: React.FC<ProductStatusBadgesProps> = ({ published, outOfStock }) => (
  <div className='mt-2 flex flex-wrap gap-2'>
    <Badge
      variant={published ? 'default' : 'secondary'}
      className='gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-foreground'
    >
      {published ? 'منشور' : 'غير منشور'}
    </Badge>
    <Badge
      variant={outOfStock ? 'destructive' : 'default'}
      className='gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-destructive'
    >
      {outOfStock ? 'غير متوفر' : 'متوفر'}
    </Badge>
  </div>
);

export default ProductStatusBadges;
