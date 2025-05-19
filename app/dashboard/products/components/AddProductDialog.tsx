'use client';
import AddProductForm from './AddProductForm';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Define a simple type for categories to be passed down
interface SimpleCategory {
  id: string;
  name: string;
}

interface AddProductDialogProps {
  supplierId?: string;
  disabled?: boolean;
  categories: SimpleCategory[]; // Add categories prop
}

export default function AddProductDialog({ supplierId, disabled, categories }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='bg-primary text-primary-foreground hover:bg-primary/90'
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          إضافة منتج جديد
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[90vw] max-w-[90vw] border-border bg-background text-foreground shadow-lg sm:w-[90vw] sm:max-w-[90vw] md:w-[90vw] md:max-w-2xl lg:w-[90vw] lg:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='mb-2 text-center text-xl font-extrabold tracking-tight text-primary'>
            إضافة منتج جديد
          </DialogTitle>
        </DialogHeader>
        <AddProductForm supplierId={supplierId} categories={categories} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
