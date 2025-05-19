import { Button } from '../../../../components/ui/button';

const QuantityControls = ({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => (
  <div className='mt-2 flex items-center justify-center gap-2'>
    <Button
      variant='outline'
      size='icon'
      onClick={onDecrease}
      className='h-8 w-8 rounded-full border border-border text-sm transition-colors duration-200 hover:bg-accent'
    >
      -
    </Button>
    <span className='text-sm font-medium text-foreground'>{quantity}</span>
    <Button
      variant='outline'
      size='icon'
      onClick={onIncrease}
      className='h-8 w-8 rounded-full border border-border text-sm transition-colors duration-200 hover:bg-accent'
    >
      +
    </Button>
  </div>
);

export default QuantityControls;
