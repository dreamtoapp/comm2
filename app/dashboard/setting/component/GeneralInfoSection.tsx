import { Globe, User, Info, Mail, MessageSquare, Phone, Image as ImageIcon } from 'lucide-react'; // Import lucide icons, alias Image as ImageIcon
import { FaWhatsapp } from 'react-icons/fa6'; // Import react-icons
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';
import ImageUpload from '@/components/image-upload';

import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Company } from '../../../../types/company';

interface GeneralInfoSectionProps {
  company: Company | null;
  errors: { [key: string]: string };
  onLogoUpload: (files: File[] | null) => void; // Update signature to accept File[]
}

const GeneralInfoSection = ({ company, errors, onLogoUpload }: GeneralInfoSectionProps) => {
  return (
    <Card className='relative'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Globe className={iconVariants({ size: 'sm', className: 'text-primary' })} /> {/* Use direct import + CVA */}
          المعلومات العامة
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Full Name */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='fullName' className='flex items-center gap-1'>
              <User className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              الاسم الكامل
            </Label>
            <span
              className='cursor-help text-xs text-muted-foreground'
              title='الاسم الرسمي المسجل للشركة'
            >
              <Info className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
            </span>
          </div>
          <div className='relative'>
            <Input
              id='fullName'
              name='fullName'
              defaultValue={company?.fullName}
              aria-invalid={!!errors.fullName}
              className='pl-8 rtl:pl-0 rtl:pr-8'
            />
            <div className='absolute left-2 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-2'>
              <User className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import + CVA */}
            </div>
          </div>
          {errors.fullName && <p className='mt-1 text-xs text-red-500'>{errors.fullName}</p>}
          <p className='text-xs text-muted-foreground'>يجب أن يتطابق مع الوثائق الرسمية</p>
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='email' className='flex items-center gap-1'>
              <Mail className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              البريد الإلكتروني
            </Label>
          </div>
          <div className='relative'>
            <Input
              id='email'
              name='email'
              type='email'
              defaultValue={company?.email}
              aria-invalid={!!errors.email}
              className='pl-8 rtl:pl-0 rtl:pr-8'
            />
            <div className='absolute left-2 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-2'>
              <Mail className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import + CVA */}
            </div>
          </div>
          {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email}</p>}
          <p className='text-xs text-muted-foreground'>البريد الرسمي للشركة</p>
        </div>

        {/* Bio */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='bio' className='flex items-center gap-1'>
              <MessageSquare className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              روئيتنا
            </Label>
          </div>
          <div className='relative'>
            <Input
              id='bio'
              name='bio'
              defaultValue={company?.bio}
              className='pl-8 rtl:pl-0 rtl:pr-8'
            />
            <div className='absolute left-2 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-2'>
              <MessageSquare className={iconVariants({ size: 'xs', className: 'text-muted-foreground' })} /> {/* Use direct import + CVA */}
            </div>
          </div>
          <p className='text-xs text-muted-foreground'>
            اكتب رؤية الشركة بشكل مختصر (حد أقصى 255 حرف)
          </p>
        </div>

        {/* Phone Number */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='phoneNumber' className='flex items-center gap-1'>
              <Phone className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              رقم الهاتف
            </Label>
          </div>
          <div className='relative'>
            <Input
              id='phoneNumber'
              name='phoneNumber'
              defaultValue={company?.phoneNumber}
              aria-invalid={!!errors.phoneNumber}
              className='pl-20 rtl:pl-0 rtl:pr-20'
              inputMode='tel'
              pattern='[0-9]*'
            />
            <div className='absolute left-2 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-2'>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <span className='text-xs'>+966</span>
                <Phone className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              </div>
            </div>
          </div>
          {errors.phoneNumber && <p className='mt-1 text-xs text-red-500'>{errors.phoneNumber}</p>}
        </div>

        {/* WhatsApp Number */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='whatsappNumber' className='flex items-center gap-1'>
              <FaWhatsapp className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              رقم الواتساب
            </Label>
          </div>
          <div className='relative'>
            <Input
              id='whatsappNumber'
              name='whatsappNumber'
              defaultValue={company?.whatsappNumber}
              aria-invalid={!!errors.whatsappNumber}
              className='pl-20 rtl:pl-0 rtl:pr-20'
              inputMode='tel'
              pattern='[0-9]*'
            />
            <div className='absolute left-2 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-2'>
              <div className='flex items-center gap-1 text-muted-foreground'>
                <span className='text-xs'>+966</span>
                <FaWhatsapp className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
              </div>
            </div>
          </div>
          {errors.whatsappNumber && (
            <p className='mt-1 text-xs text-red-500'>{errors.whatsappNumber}</p>
          )}
          <p className='text-xs text-muted-foreground'>
            مثال: 9665xxxxxxxx (بدون علامة + أو مسافات)
          </p>
        </div>
        <div className='w-fit space-y-2 md:col-span-2'>
          <Label className='block'>
            <span className='mb-2 flex items-center gap-1'>
              <ImageIcon className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA (aliased) */}
              شعار الشركة
            </span>
            <ImageUpload
              initialImage={company?.logo}
              onImageUpload={onLogoUpload} // تمرير الدالة لتحديث حالة الصورة المرفوعة
              aspectRatio={1}
              maxSizeMB={2}
              allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
              uploadLabel='انقر لرفع الصورة'
              previewType='contain'
              className='h-36'
              alt='شعار الشركة'
              minDimensions={{ width: 500, height: 500 }}
              error={errors.logo}
            />
            {errors.logo && <p className='mt-1 text-xs text-red-500'>{errors.logo}</p>}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoSection;
