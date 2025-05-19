import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton';

const SettingsSkeleton = () => (
  <div className='space-y-6'>
    {/* General Info Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-[200px]' />
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='space-y-2'>
            <Skeleton className='h-4 w-[80px]' />
            <Skeleton className='h-9 w-full' />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Social Media Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-[200px]' />
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex items-center'>
              <Skeleton className='mr-2 h-4 w-4' />
              <Skeleton className='h-4 w-[100px]' />
            </div>
            <Skeleton className='h-9 w-full' />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Location Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-[200px]' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[80px]' />
          <Skeleton className='h-9 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full max-w-[300px]' />
          <Skeleton className='h-9 w-[150px]' />
        </div>
      </CardContent>
    </Card>

    {/* Submit Button Skeleton */}
    <Skeleton className='h-10 w-full' />
  </div>
);

export default SettingsSkeleton;
