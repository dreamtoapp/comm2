'use client';
import { useActionState, useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import InputField from '@/components/InputField'; // Assuming general InputField
import TextareaField from '@/components/TextareaField'; // Assuming general TextareaField
import ImageUpload from '@/components/image-upload'; // Assuming general ImageUpload
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { createSupplier } from '../actions/createSupplier'; // Use the actual action


export default function AddSupplierForm() {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(createSupplier, {
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
    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="name" label="اسم المورد" placeholder="أدخل اسم المورد" required />
        <InputField name="email" label="البريد الإلكتروني" type="email" placeholder="supplier@example.com" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="phone" label="رقم الهاتف" type="tel" placeholder="+966XXXXXXXXX" />
        <div>
          <Label htmlFor="type">نوع المورد</Label>
          <Select name="type" defaultValue="company">
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

      <TextareaField name="address" label="العنوان" placeholder="أدخل عنوان المورد" rows={3} />

      <div>
        <Label htmlFor="logo">شعار المورد (اختياري)</Label>
        <ImageUpload
          name="logo-upload" // Name for the input itself, 'logo' will be appended to FormData
          initialImage={logoPreviewUrl}
          onImageUpload={handleLogoSelect}
          aspectRatio={1} // Square for logos
          maxSizeMB={1}
          multiple={false}
          allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
          uploadLabel="تحميل الشعار"
          previewType="contain"
          alt="شعار المورد"
        />
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? 'جارٍ الحفظ...' : 'حفظ المورد'}
        </Button>
      </div>
    </form>
  );
}
