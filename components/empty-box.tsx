import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmptyBox({ title, description }: { title: string; description: string }) {
  return (
    <Alert variant='default' className='w-full text-center'>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
