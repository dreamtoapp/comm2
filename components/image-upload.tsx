import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Eye,
  ImageOff,
  Trash2,
  UploadCloud,
  X,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import type { Accept } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  cn,
  iconVariants,
} from '@/lib/utils';
import fallbackImage from '@/public/fallback/fallback.webp';

// --- Types ---
export interface ImageUploadError {
  type: 'size' | 'type' | 'dimensions' | 'unknown';
  message: string;
}

export interface ImageUploadI18n {
  uploadLabel: string;
  chooseImage: string;
  noImage: string;
  previewTitle: string;
  maxSize: string;
  minDimensions: string;
  allowedTypes: string;
  errorFallback: string;
  errorRejected: string;
  filesUploaded: string;
  maxFiles: string;
}

export interface ImageUploadProps {
  initialImage?: string | string[] | null;
  onImageUpload: (files: File[] | null) => void;
  aspectRatio?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  minDimensions?: { width: number; height: number };
  disabled?: boolean;
  className?: string;
  uploadLabel?: string;
  previewType?: 'cover' | 'contain';
  quality?: number;
  alt?: string;
  priority?: boolean;
  error?: string | null;
  name?: string;
  showInstruction?: boolean;
  i18n?: Partial<ImageUploadI18n>;
  icons?: Partial<{
    upload: React.ReactNode;
    remove: React.ReactNode;
    refresh: React.ReactNode;
    zoom: React.ReactNode;
    error: React.ReactNode;
  }>;
  customActions?: React.ReactNode;
  width?: number;
  height?: number;
  multiple?: boolean;
  maxFiles?: number;
  required?: boolean; // Add required prop
  // usageContextHint prop removed
}

const defaultI18n: ImageUploadI18n = {
  uploadLabel: 'اسحب وأفلت الصورة هنا أو انقر للتحميل',
  chooseImage: 'اختر صورة',
  noImage: 'لا توجد صورة',
  previewTitle: 'معاينة الصورة',
  maxSize: 'الحجم الأقصى',
  minDimensions: 'الأبعاد الدنيا',
  allowedTypes: 'صيغ الملفات المسموح بها',
  errorFallback: 'صورة غير صالحة',
  errorRejected: 'تم رفض الملف',
  filesUploaded: 'ملفات تم تحميلها',
  maxFiles: 'الحد الأقصى للملفات',
};

const VALID_ERROR_TYPES = ['size', 'type', 'dimensions', 'unknown'] as const;
type ValidErrorType = (typeof VALID_ERROR_TYPES)[number];
const isValidErrorType = (type: unknown): type is ValidErrorType => {
  return typeof type === 'string' && VALID_ERROR_TYPES.includes(type as ValidErrorType);
};

// --- Validation Utility ---
function validateImageUtil(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number,
  minDimensions?: { width: number; height: number }
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!allowedTypes.includes(file.type)) {
      reject({
        type: 'type',
        message: `${defaultI18n.allowedTypes}: ${allowedTypes.join(', ')}`,
      });
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      reject({
        type: 'size',
        message: `${defaultI18n.maxSize}: ${maxSizeMB}MB`,
      });
      return;
    }

    if (minDimensions) {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width < minDimensions.width || img.height < minDimensions.height) {
          reject({
            type: 'dimensions',
            message: `${defaultI18n.minDimensions}: ${minDimensions.width}x${minDimensions.height} بكسل`,
          });
        } else {
          resolve();
        }
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        reject({ type: 'unknown', message: defaultI18n.errorFallback });
        URL.revokeObjectURL(img.src);
      };
    } else {
      resolve();
    }
  });
}

// --- Subcomponents ---
function ImageErrorMessage({
  errors,
  icon,
}: {
  errors: ImageUploadError[];
  icon: React.ReactNode;
}) {
  if (!errors.length) return null;

  return (
    <div className='mt-1 text-center text-xs text-destructive' role='alert' aria-live='assertive'>
      {icon}{' '}
      {errors.map((err, i) => (
        <span key={i}>{err.message}</span>
      ))}
    </div>
  );
}

function ImageActions({ customActions }: { customActions?: React.ReactNode }) {
  return (
    <div className='mt-2 flex items-center justify-center gap-2'>{customActions}</div>
  );
}

function ImageUploadButton({
  open,
  disabled,
  label,
  icon,
}: {
  open: () => void;
  disabled: boolean;
  label: string | React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Button
      type='button'
      variant='outline'
      className='flex w-full items-center justify-center gap-2'
      onClick={open}
      disabled={disabled}
    >
      {icon || <UploadCloud className={iconVariants({ size: 'sm' })} />}
      <span>{label}</span>
    </Button>
  );
}

function ImagePreview({
  preview,
  alt,
  onZoom,
  onDelete,
  onError,
  previewType,
  quality,
  priority,
  i18n,
  icon,
  width,
  height,
  aspectRatio,
}: {
  preview: string | null;
  alt: string;
  onZoom: () => void;
  onDelete: () => void;
  onError: () => void;
  previewType: 'cover' | 'contain';
  quality: number;
  priority: boolean;
  i18n: ImageUploadI18n;
  icon: React.ReactNode;
  width?: number;
  height?: number;
  aspectRatio?: number;
}) {
  const showPlaceholder = !preview;

  return (
    <div
      className='relative flex min-h-[120px] w-full max-w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-primary/40 bg-muted transition-shadow focus-within:ring-2 focus-within:ring-primary/50'
      style={{
        aspectRatio: aspectRatio || (width && height ? width / height : 1),
        maxWidth: width ? `${width}px` : undefined,
        maxHeight: height ? `${height}px` : undefined,
        backgroundImage: showPlaceholder ? `url(${fallbackImage.src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6',
      }}
      tabIndex={0}
      aria-label={showPlaceholder ? i18n.noImage : alt}
    >
      {preview ? (
        <>
          <Image
            src={preview}
            alt={alt}
            fill
            className={`object-${previewType} h-full w-full select-none`}
            quality={quality}
            priority={priority}
            onError={onError}
          />
          <div className='absolute left-2 top-2 z-10 flex gap-2'>
            <button
              type='button'
              className='rounded-full bg-background/70 p-1 transition hover:bg-muted'
              onClick={onZoom}
              tabIndex={0}
              aria-label='تكبير الصورة'
            >
              {icon || <ZoomIn className={iconVariants({ size: 'sm' })} />}
            </button>
            <button
              type='button'
              className='rounded-full bg-background/70 p-1 transition hover:bg-muted'
              onClick={onDelete}
              tabIndex={0}
              aria-label='حذف الصورة'
            >
              <Trash2 className={iconVariants({ size: 'sm', variant: 'destructive' })} />
            </button>
          </div>
        </>
      ) : (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/60'>
          <UploadCloud className={iconVariants({ size: 'lg', className: 'text-primary/70' })} />
          <span className='text-xs font-medium text-muted-foreground'>
            {i18n.noImage}
          </span>
        </div>
      )}
    </div>
  );
}

const ImageUpload = ({
  initialImage = null,
  onImageUpload,
  aspectRatio = 1,
  maxSizeMB = 2,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  minDimensions,
  disabled = false,
  className,
  uploadLabel = 'اختر صورة',
  previewType = 'cover',
  quality = 75,
  alt = 'معاينة الصورة',
  priority = false,
  error: parentError,
  name,
  i18n: i18nOverride,
  icons = {},
  customActions,
  width,
  height,
  multiple = false,
  maxFiles = 5,
  required = false, // Default required to false
  // usageContextHint removed from destructuring
}: ImageUploadProps) => {
  const i18n = {
    ...defaultI18n,
    ...(uploadLabel ? { uploadLabel } : {}),
    ...i18nOverride,
  };

  const initialPreviews = useMemo(() => {
    if (!initialImage) return [];
    return Array.isArray(initialImage) ? initialImage : [initialImage];
  }, [initialImage]);

  const [previews, setPreviews] = useState<string[]>(initialPreviews);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ImageUploadError[][]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    setPreviews(initialPreviews);
  }, [initialPreviews]);

  const acceptTypes = useMemo(() => {
    return allowedTypes.reduce((acc, type) => {
      acc[type as keyof Accept] = [];
      return acc;
    }, {} as Accept);
  }, [allowedTypes]);

  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview?.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  const validateImage = useCallback(
    (file: File) => validateImageUtil(file, allowedTypes, maxSizeMB, minDimensions),
    [allowedTypes, maxSizeMB, minDimensions]
  );

  const processFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setErrors([]);
      try {
        await validateImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreviews([previewUrl]);
        setUploadedFiles([file]);
        onImageUpload([file]);
      } catch (caught: unknown) {
        let uploadError: ImageUploadError;
        if (
          typeof caught === 'object' &&
          caught !== null &&
          'type' in caught &&
          'message' in caught &&
          isValidErrorType((caught as ImageUploadError).type)
        ) {
          const errObj = caught as ImageUploadError;
          uploadError = {
            type: errObj.type,
            message: errObj.message,
          };
        } else {
          uploadError = {
            type: 'unknown',
            message: i18n.errorFallback,
          };
        }
        setErrors([[uploadError]]);
        onImageUpload(null);
      } finally {
        setIsLoading(false);
      }
    },
    [validateImage, onImageUpload, i18n.errorFallback]
  );

  const processMultipleFiles = useCallback(
    async (files: File[]) => {
      setIsLoading(true);
      const newPreviews: string[] = [];
      const newFiles: File[] = [];
      const allErrors: ImageUploadError[][] = [];

      for (const file of files) {
        try {
          await validateImage(file);
          const url = URL.createObjectURL(file);
          newPreviews.push(url);
          newFiles.push(file);
          allErrors.push([]);
        } catch (error) {
          allErrors.push([error as ImageUploadError]);
          newPreviews.push('');
        }
      }

      setPreviews(newPreviews);
      setUploadedFiles(newFiles);
      setErrors(allErrors);
      onImageUpload(newFiles.length ? newFiles : null);
      setIsLoading(false);
    },
    [validateImage, onImageUpload]
  );

  const { getInputProps, open } = useDropzone({
    onDropAccepted: (acceptedFiles) => {
      if (multiple) {
        processMultipleFiles(acceptedFiles);
      } else {
        processFile(acceptedFiles[0]);
      }
    },
    accept: acceptTypes,
    disabled,
    multiple,
    maxSize: maxSizeMB * 1024 * 1024,
    noClick: true,
    noDrag: true,
    maxFiles: multiple ? maxFiles : 1,
  });

  const handleZoom = useCallback((index: number) => {
    setActivePreviewIndex(index);
    setIsDialogOpen(true);
  }, []);

  const handleRemove = useCallback((index: number) => {
    const newPreviews = [...previews];
    const newFiles = [...uploadedFiles];
    const newErrors = [...errors];

    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);
    newErrors.splice(index, 1);

    setPreviews(newPreviews);
    setUploadedFiles(newFiles);
    setErrors(newErrors);

    onImageUpload(newFiles.length ? newFiles : null);
  }, [previews, uploadedFiles, errors, onImageUpload]);

  const allErrors = useMemo(() => {
    const result = [...errors.flat()];
    if (parentError) {
      result.unshift({ type: 'unknown', message: parentError });
    }
    return result;
  }, [errors, parentError]);

  return (
    <div className={cn('flex w-full flex-col items-start justify-start gap-2', className)}>
      <input {...getInputProps()} name={name} />

      <div className='relative w-full'>
        {multiple ? (
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {previews.map((preview, index) => (
              <div key={index} className='relative'>
                <ImagePreview
                  preview={preview}
                  alt={`${alt} ${index + 1}`}
                  onZoom={() => handleZoom(index)}
                  onDelete={() => handleRemove(index)}
                  onError={() => {
                    const newErrors = [...errors];
                    newErrors[index] = [{ type: 'unknown', message: defaultI18n.errorFallback }];
                    setErrors(newErrors);
                  }}
                  previewType={previewType}
                  quality={quality}
                  priority={priority}
                  i18n={i18n}
                  icon={icons?.zoom}
                  width={width}
                  height={height}
                  aspectRatio={aspectRatio}
                />
                {errors[index]?.length > 0 && (
                  <ImageErrorMessage
                    errors={errors[index]}
                    icon={icons?.error || <ImageOff className={iconVariants({ size: 'xs' })} />}
                  />
                )}
              </div>
            ))}

            {previews.length < maxFiles && (
              <div className='relative'>
                <ImagePreview
                  preview={null}
                  alt='Upload new image'
                  onZoom={() => { }}
                  onDelete={() => { }}
                  onError={() => { }}
                  previewType={previewType}
                  quality={quality}
                  priority={priority}
                  i18n={i18n}
                  icon={icons?.upload}
                  width={width}
                  height={height}
                  aspectRatio={aspectRatio}
                />
              </div>
            )}
          </div>
        ) : (
          <ImagePreview
            preview={previews[0] || null}
            alt={alt}
            onZoom={() => handleZoom(0)}
            onDelete={() => handleRemove(0)}
            onError={() => { }}
            previewType={previewType}
            quality={quality}
            priority={priority}
            i18n={i18n}
            icon={icons?.zoom}
            width={width}
            height={height}
            aspectRatio={aspectRatio}
          />
        )}
      </div>

      <div className='mb-2 flex w-full items-center gap-2'>
        <button
          type='button'
          className='flex items-center gap-1 rounded border border-primary/20 bg-muted px-2 py-1 text-xs text-primary transition hover:bg-primary/10'
          onClick={() => setShowHint(h => !h)}
          aria-expanded={showHint}
          aria-controls='image-upload-hint'
        >
          {showHint ? <X className={iconVariants({ size: 'xs' })} /> : <Eye className={iconVariants({ size: 'xs' })} />}
        </button>
        <div className='flex-1'>
          <ImageUploadButton
            open={open}
            disabled={disabled || isLoading || (multiple && previews.length >= maxFiles)}
            label={required ? `${uploadLabel} *` : uploadLabel} // Append asterisk if required
            icon={icons?.upload}
          />
        </div>
      </div>

      {showHint && (
        <div
          id='image-upload-hint'
          className='mb-2 flex w-full flex-col gap-1 rounded-md border border-primary/20 bg-white/90 px-4 py-2 text-xs text-muted-foreground shadow'
          dir='rtl'
        >
          <div>
            <b>الأنواع المسموحة:</b>{' '}
            {allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')}
          </div>
          <div>
            <b>الحجم الأقصى:</b> {maxSizeMB} ميجابايت
          </div>
          {minDimensions && (
            <div>
              <b>الأبعاد الدنيا:</b> {minDimensions.width}×{minDimensions.height} بكسل
            </div>
          )}
          {multiple && (
            <div>
              <b>الحد الأقصى للملفات:</b> {maxFiles}
            </div>
          )}
          <div>اختر صورة واضحة للمنتج</div>
          {/* usageContextHint rendering removed */}
        </div>
      )}

      <ImageActions customActions={customActions} />
      <ImageErrorMessage
        errors={allErrors}
        icon={icons?.error || <ImageOff className={iconVariants({ size: 'xs' })} />}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogTitle>{i18n.previewTitle}</DialogTitle>
          {activePreviewIndex !== null && previews[activePreviewIndex] && (
            <div className='relative h-96 w-full'>
              <Image
                src={previews[activePreviewIndex]}
                alt={`${alt} ${activePreviewIndex + 1}`}
                fill
                className='h-full w-full rounded-md object-contain'
                quality={quality}
                priority={priority}
                loading='lazy'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
