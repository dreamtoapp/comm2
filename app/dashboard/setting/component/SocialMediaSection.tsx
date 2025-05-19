import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
// Removed Icon import: import { Icon } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Company } from '../../../../types/company';

const SocialMediaSection = ({ company }: { company: Company | null }) => (
  <Card>
    <CardHeader>
      <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
    </CardHeader>
    <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {[
        { id: 'twitter', iconName: Twitter, label: 'تويتر' }, // Use component reference
        { id: 'linkedin', iconName: Linkedin, label: 'لينكد إن' }, // Use component reference
        { id: 'facebook', iconName: Facebook, label: 'فيسبوك' }, // Use component reference
        { id: 'instagram', iconName: Instagram, label: 'إنستغرام' }, // Use component reference
      ].map(({ id, iconName: IconComponent, label }) => ( // Rename iconName to IconComponent
        <div key={id}>
          <Label htmlFor={id}>
            <IconComponent className={iconVariants({ size: 'sm', className: 'mr-2 inline-block' })} /> {label} {/* Render component + CVA */}
          </Label>
          {(() => {
            const value = company?.[id as keyof Company];
            const defaultValue = typeof value === 'string' ? value : ''; // Ensure only string or empty string is passed
            return (
              <Input
                id={id}
                name={id}
                defaultValue={defaultValue}
                placeholder={`أدخل رابط ${label}`}
              />
            );
          })()}
        </div>
      ))}
    </CardContent>
  </Card>
);

export default SocialMediaSection;
