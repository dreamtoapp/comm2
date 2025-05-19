'use client';

import {
  useActionState,
  useEffect,
  useState, // Restore useState
  type ChangeEvent, // Restore ChangeEvent
} from 'react';

import { useRouter } from 'next/navigation';
import ReactSwal from '@/lib/swal-config';

import { createSeoEntry } from '@/app/seo/actions/createSeoEntry';
import { CreateSeoFormTooltips } from '@/app/seo/constant/tooltip-content'; // Import new constants
// import { useSeoForm, SeoFormProvider } from '@/app/seo/context/seo-form-context'; // Remove context import
import { Button } from '@/components/ui/button';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  EntityType,
  IndustryType,
} from '@prisma/client';

// Define CreateSeoFormState directly in the component
type CreateSeoFormState = {
  entityId: string;
  metaTitle: string;
  metaDescription: string;
  entityType: EntityType;
  industryType: IndustryType;
  canonicalUrl?: string;
};

const initialState = {
  success: false,
  errors: {},
  data: undefined,
};

export default function CreateSeoForm() {
  const router = useRouter();
  // const { formData, handleChange, handleSelectChange, setFormData } = useSeoForm(); // Remove context usage
  const [state, formAction, isPending] = useActionState(createSeoEntry, initialState);

  // Manage formData locally
  const [formData, setFormData] = useState<CreateSeoFormState>({
    entityId: '',
    metaTitle: '',
    metaDescription: '',
    entityType: EntityType.PAGE,
    industryType: IndustryType.OTHER,
    canonicalUrl: '',
  });

  useEffect(() => {
    if (!state.success && state.data && typeof state.data === 'object' && 'entityId' in state.data) {
      setFormData(state.data as CreateSeoFormState);
    }

    if (state.success && state.data && 'id' in state.data) {
      ReactSwal.fire({
        title: 'Success!',
        text: 'Page SEO entry created successfully!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        router.push('/seo');
        router.refresh();
      });
    } else if (!state.success && state.errors && Object.keys(state.errors).length > 0) {
      const fieldErrors = Object.entries(state.errors).filter(([key]) => key !== '_form');
      if (fieldErrors.length > 0) {
        const errorMessages = fieldErrors.map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`);
        ReactSwal.fire({
          title: 'Error!',
          html: `Failed to create SEO entry:<ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`,
          icon: 'error',
        });
      } else if (state.errors._form) {
        ReactSwal.fire({
          title: 'Error!',
          text: (state.errors._form as string[]).join('\n'),
          icon: 'error',
        });
      }
    }
  }, [state, router, setFormData]);

  // Define handleChange and handleSelectChange locally
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof CreateSeoFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  return (
    <form action={formAction} className='space-y-6'>
      {state.errors?._form && (
        <div className='rounded border border-destructive bg-destructive/10 px-4 py-3 text-destructive'>
          {Array.isArray(state.errors._form) ? state.errors._form.map((err, i) => <p key={i}>{err}</p>) : <p>{state.errors._form}</p>}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='entityId'>Entity ID / Slug</Label>
          <InfoTooltip content={CreateSeoFormTooltips.entityId} />
        </div>
        <Input
          id='entityId'
          name='entityId'
          value={formData.entityId}
          onChange={handleChange}
          className={`${state.errors?.entityId ? 'border-destructive' : ''}`}
          required
        />
        {state.errors?.entityId && <p className='text-sm text-destructive'>{state.errors.entityId.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='metaTitle'>Meta Title</Label>
          <InfoTooltip content={CreateSeoFormTooltips.metaTitle} />
        </div>
        <Input
          id='metaTitle'
          name='metaTitle'
          value={formData.metaTitle}
          onChange={handleChange}
          maxLength={120}
          className={`${state.errors?.metaTitle ? 'border-destructive' : ''}`}
          required
        />
        {state.errors?.metaTitle && <p className='text-sm text-destructive'>{state.errors.metaTitle.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='metaDescription'>Meta Description</Label>
          <InfoTooltip content={CreateSeoFormTooltips.metaDescription} />
        </div>
        <Textarea
          id='metaDescription'
          name='metaDescription'
          value={formData.metaDescription}
          onChange={handleChange}
          maxLength={320}
          rows={3}
          className={`${state.errors?.metaDescription ? 'border-destructive' : ''}`}
        />
        {state.errors?.metaDescription && <p className='text-sm text-destructive'>{state.errors.metaDescription.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='entityType'>Entity Type</Label>
          <InfoTooltip content={CreateSeoFormTooltips.entityType} />
        </div>
        <Select
          name="entityType"
          value={formData.entityType}
          onValueChange={(value) => handleSelectChange('entityType', value as EntityType)}
          defaultValue={EntityType.PAGE}
        >
          <SelectTrigger id="entityType" className={`${state.errors?.entityType ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(EntityType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.entityType && <p className='text-sm text-destructive'>{state.errors.entityType.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='industryType'>Industry Type</Label>
          <InfoTooltip content={CreateSeoFormTooltips.industryType} />
        </div>
        <Select
          name="industryType"
          value={formData.industryType}
          onValueChange={(value) => handleSelectChange('industryType', value as IndustryType)}
          defaultValue={IndustryType.OTHER}
        >
          <SelectTrigger id="industryType" className={`${state.errors?.industryType ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select industry type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(IndustryType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.industryType && <p className='text-sm text-destructive'>{state.errors.industryType.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor='canonicalUrl'>Canonical URL</Label>
          <InfoTooltip content={CreateSeoFormTooltips.canonicalUrl} />
        </div>
        <Input
          id='canonicalUrl'
          name='canonicalUrl'
          value={formData.canonicalUrl || ''}
          onChange={handleChange}
          className={`${state.errors?.canonicalUrl ? 'border-destructive' : ''}`}
        />
        {state.errors?.canonicalUrl && <p className='text-sm text-destructive'>{state.errors.canonicalUrl.join(', ')}</p>}
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create & Continue to Edit'}
        </Button>
      </div>
    </form>
  );
}
