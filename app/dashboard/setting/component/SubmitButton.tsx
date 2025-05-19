import { Button } from '../../../../components/ui/button';

// Submit Button Component
const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <Button type='submit' className='w-full' disabled={isSubmitting}>
    {isSubmitting ? (
      <div className='flex items-center justify-center'>
        <span className='mr-3 animate-spin'>🌀</span>
        جاري الحفظ...
      </div>
    ) : (
      'حفظ التغييرات'
    )}
  </Button>
);

export default SubmitButton;
