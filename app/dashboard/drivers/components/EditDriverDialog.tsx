// app/dashboard/drivers/components/EditDriverDialog.tsx
'use client'; // Mark as a Client Component

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateDriver } from '../actions/Actions';

interface EditDriverDialogProps {
  driver: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    password?: string | null; // Allow null
    imageUrl?: string | null;
  };
  children: React.ReactNode;
}

export default function EditDriverDialog({ driver, children }: EditDriverDialogProps) {
  const [formData, setFormData] = useState({
    name: driver.name,
    email: driver.email,
    phone: driver.phone || '', // Default null phone to empty string for input
    password: driver.password || '',
    imageFile: null as File | null, // File for image upload
  });
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'imageFile' && files && files.length > 0) {
      setFormData({ ...formData, imageFile: files[0] }); // Set the uploaded file
    } else {
      setFormData({ ...formData, [name]: value }); // Update text fields
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateDriver(driver.id, formData); // Call the server action to update the driver
      window.location.reload(); // Refresh the page after updating
    } catch (e) {
      let errorMessage = 'Failed to update driver.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error updating driver:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      {/* Trigger for opening the dialog */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Driver</DialogTitle>
          <DialogDescription>Update the details of the driver below.</DialogDescription>
        </DialogHeader>

        {/* Form Fields */}
        <div className='space-y-4'>
          {/* Name Field */}
          <Input
            name='name'
            placeholder='Driver Name'
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email Field */}
          <Input
            name='email'
            type='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone Field */}
          <Input
            name='phone'
            placeholder='Phone Number'
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            name='password'
            placeholder='password '
            value={formData.password}
            onChange={handleChange}
          />

          {/* Image Upload Field */}
          <Input name='imageFile' type='file' accept='image/*' onChange={handleChange} />
        </div>

        {/* Dialog Footer with Submit Button */}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Driver'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
