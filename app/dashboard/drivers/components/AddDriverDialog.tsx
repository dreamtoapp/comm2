// app/dashboard/drivers/components/AddDriverDialog.tsx
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
import { createDriver } from '../actions/Actions';
import Image from 'next/image';

export default function AddDriverDialog({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    imageFile: null as File | null, // File for image upload
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'imageFile' && files && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, imageFile: file }); // Set the uploaded file
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    } else {
      setFormData({ ...formData, [name]: value }); // Update text fields
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createDriver(formData); // Call the server action to create the driver
      window.location.reload(); // Refresh the page after adding
    } catch (e) {
      let errorMessage = 'Failed to add driver.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error adding driver:', errorMessage);
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
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>Enter the details of the new driver below.</DialogDescription>
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
            placeholder='password'
            value={formData.password}
            onChange={handleChange}
          />

          {/* Image Upload Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>Profile Image</label>
            <Input name='imageFile' type='file' accept='image/*' onChange={handleChange} />
            {/* Image Preview */}
            {imagePreview && (
              <div className='mt-2'>
                <Image
                  src={imagePreview}
                  alt='Preview'
                  width={128}
                  height={128}
                  className='h-32 w-32 rounded-md object-cover'
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        {/* Dialog Footer with Submit Button */}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
