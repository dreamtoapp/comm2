import CartSummary from './CartSummary';

const CartSummarySection = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='sticky top-24 w-full max-w-sm self-start rounded-xl bg-card p-5 text-foreground shadow-lg dark:shadow-gray-800/50'>
      {isLoading ? (
        <div className='h-48 animate-pulse space-y-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-700'>
          <div className='h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600'></div>
          <div className='h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600'></div>
          <div className='h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-600'></div>
          <div className='h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-600'></div>
          <div className='h-10 rounded bg-gray-300 dark:bg-gray-600'></div>
        </div>
      ) : (
        <CartSummary />
      )}
    </div>
  );
};
export default CartSummarySection;
