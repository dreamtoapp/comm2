'use client'

import {
  useEffect,
  useState,
  useTransition,
  ChangeEvent,
  FormEvent,
} from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slugify } from '@/utils/slug'; // Import Slugify

import {
  createCategory,
  handleImageUploadToServer,
  updateCategory,
} from '../actions';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryFormProps {
  initialData?: Category | null;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSlug(initialData.slug || '');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (!slugManuallyEdited) {
      setSlug(Slugify(newName)); // Use the imported Slugify function
    }
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value);
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error('يجب أن يتكون اسم الصنف من حرفين على الأقل.');
      return;
    }
    // Validate slug: ensure it's not empty after Slugify and fits regex if needed
    // The Slugify function from utils/slug.ts already produces a valid format.
    // We just need to ensure it's not empty if the name was, for example, only special characters.
    const finalSlug = Slugify(name.trim()); // Re-slugify from final name just in case
    if (!finalSlug.trim() || finalSlug.trim().length < 1) { // Slug can be 1 char e.g. "a"
      toast.error('الاسم اللطيف (slug) لا يمكن أن يكون فارغًا أو غير صالح بعد المعالجة. يرجى استخدام اسم صنف مختلف.');
      return;
    }
    // Update slug state with the potentially re-slugified version from final name
    // This ensures the 'values' object uses the most accurate slug if name was trimmed.
    // However, if slug was manually edited, we should respect that.
    const slugToSubmit = slugManuallyEdited ? slug.trim() : finalSlug;
    if (!slugToSubmit.trim() || !/^[a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF-]+$/.test(slugToSubmit.trim()) || slugToSubmit.trim().length < 1) {
      toast.error('الاسم اللطيف (slug) يحتوي على أحرف غير صالحة أو قصير جدًا.');
      return;
    }


    const values = {
      name: name.trim(),
      slug: slugToSubmit, // Use the validated and potentially re-slugified slug
      description: description || null,
      imageUrl: imageUrl || null,
    };

    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateCategory(initialData.id, values);
        } else {
          result = await createCategory(values);
        }

        if (result.success) {
          toast.success(initialData ? `تم تحديث الصنف "${result.category?.name}" بنجاح.` : `تم إنشاء الصنف "${result.category?.name}" بنجاح.`);
          router.push('/dashboard/categories');
          router.refresh();
        } else {
          toast.error(result.error || (initialData ? 'فشل تحديث الصنف.' : 'فشل إنشاء الصنف.'));
        }
      } catch (error: unknown) {
        toast.error('حدث خطأ غير متوقع. يرجى مراجعة الكونسول.');
        console.error("Form submission error:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="categoryName">اسم الصنف</Label>
            <Input
              id="categoryName"
              placeholder="مثال: إلكترونيات"
              value={name}
              onChange={handleNameChange}
              disabled={isPending}
              required
              minLength={2}
            />
            <p className="text-[0.8rem] text-muted-foreground">الاسم الرئيسي للصنف.</p>
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label htmlFor="categorySlug">الاسم اللطيف (للرابط)</Label>
            <Input
              id="categorySlug"
              placeholder="مثال: electronics"
              value={slug} // Display the current slug state
              onChange={handleSlugChange}
              disabled={isPending}
              required
            // pattern is implicitly handled by Slugify and validation now
            />
            <p className="text-[0.8rem] text-muted-foreground">
              نسخة صديقة لمحركات البحث من الاسم. يتم إنشاؤها تلقائيًا أو يمكن تخصيصها.
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="categoryDescription">الوصف (اختياري)</Label>
            <Textarea
              id="categoryDescription"
              placeholder="وصف موجز للصنف..."
              className="resize-none"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <Label htmlFor="categoryImage">صورة الصنف (اختياري)</Label>
          <ImageUpload
            initialImage={imageUrl}
            onImageUpload={async (files) => {
              if (files && files.length > 0) {
                const fileToUpload = files[0];
                const formData = new FormData();
                formData.append('file', fileToUpload);
                setIsUploadingImage(true);
                try {
                  const result = await handleImageUploadToServer(formData, 'amwag_assets');
                  if (result.secure_url) {
                    setImageUrl(result.secure_url);
                    toast.success('تم تحميل الصورة بنجاح!');
                  } else {
                    toast.error(result.error || 'فشل تحميل الصورة.');
                  }
                } catch (error) {
                  toast.error('فشل تحميل الصورة. يرجى المحاولة مرة أخرى.');
                  console.error("Image upload server action error:", error);
                } finally {
                  setIsUploadingImage(false);
                }
              } else {
                setImageUrl('');
              }
            }}
            disabled={isPending || isUploadingImage}
            multiple={false}
            maxSizeMB={2}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
          />
          <p className="text-[0.8rem] text-muted-foreground">
            {isUploadingImage ? "جاري تحميل الصورة..." : "قم بتحميل صورة للصنف. الحجم الأقصى 2 ميجابايت. (JPG, PNG, WEBP)"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={isPending || isUploadingImage} className="w-full md:w-auto">
          {isPending ? (initialData ? 'جاري حفظ التغييرات...' : 'جاري إنشاء الصنف...') : (initialData ? 'حفظ التغييرات' : 'إنشاء صنف')}
        </Button>
        {initialData && (
          <Button variant="outline" type="button" onClick={() => router.push('/dashboard/categories')} className="ml-2" disabled={isPending || isUploadingImage}>
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
}
