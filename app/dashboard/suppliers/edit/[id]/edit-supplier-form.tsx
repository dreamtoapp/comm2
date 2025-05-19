'use client';
import { useActionState, useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Supplier } from '@prisma/client'; // For supplier prop type

import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import ImageUpload from '@/components/image-upload';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { updateSupplier } from '../../actions/updateSupplier'; // Corrected path

interface EditSupplierFormProps {
  supplier: Supplier;
}

export default function EditSupplierForm({ supplier }: EditSupplierFormProps) {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(supplier.logo || null);

  const [state, formAction, isPending] = useActionState(updateSupplier, {
    success: false,
    message: '',
    errors: null,
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      router.push('/dashboard/suppliers'); // Redirect on success
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleLogoSelect = (files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null;
    setLogoFile(file);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('id', supplier.id); // Ensure ID is part of FormData for update
    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name);
    } else if (logoPreviewUrl === null && supplier.logo) {
      // If preview is cleared and there was an old logo, signal removal
      formData.append('removeLogo', 'true');
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 rounded-xl border border-border bg-card p-6 shadow-lg md:p-8'
    >
      <input type="hidden" name="id" value={supplier.id} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="name" label="اسم المورد" defaultValue={supplier.name} required />
        <InputField name="email" label="البريد الإلكتروني" type="email" defaultValue={supplier.email || ''} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="phone" label="رقم الهاتف" type="tel" defaultValue={supplier.phone || ''} />
        <div>
          <Label htmlFor="type">نوع المورد</Label>
          <Select name="type" defaultValue={supplier.type || 'company'}>
            <SelectTrigger id="type">
              <SelectValue placeholder="اختر نوع المورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">شركة</SelectItem>
              <SelectItem value="individual">فرد</SelectItem>
              <SelectItem value="other">آخر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TextareaField name="address" label="العنوان" defaultValue={supplier.address || ''} rows={3} />

      <div>
        <Label htmlFor="logo">شعار المورد (اختياري)</Label>
        <ImageUpload
          name="logo-upload"
          initialImage={logoPreviewUrl}
          onImageUpload={handleLogoSelect}
          // onImageRemove is not a prop of ImageUpload; its internal delete calls onImageUpload(null)
          aspectRatio={1}
          maxSizeMB={1}
          multiple={false}
          allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
          uploadLabel="تغيير أو تحميل الشعار"
          previewType="contain"
          alt="شعار المورد"
        />
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/suppliers')}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </Button>
      </div>
    </form>
  );
}
