// app/dashboard/drivers/actions.ts
'use server';
import db from '@/lib/prisma';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

// Create a new driver
export async function createDriver(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  imageFile?: File | null; // Allow both undefined and null
}) {
  try {
    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (data.imageFile) {
      const cloudinaryResponse = await uploadImageToCloudinary(
        data.imageFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_DRIVER || '',
      );

      if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        throw new Error('Failed to upload image to Cloudinary.');
      }

      imageUrl = cloudinaryResponse.secure_url;
    }

    const driver = await db.driver.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        imageUrl: imageUrl,
      },
    });

    return driver;
  } catch (error) {
    console.error('Error creating driver:', error);
    throw new Error('Failed to create driver.');
  }
}

// Fetch all drivers
export async function getDrivers() {
  try {
    const drivers = await db.driver.findMany();
    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw new Error('Failed to fetch drivers.');
  }
}

// Update an existing driver
export async function updateDriver(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    imageFile?: File | null; // Allow both undefined and null
  },
) {
  try {
    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (data.imageFile) {
      const cloudinaryResponse = await uploadImageToCloudinary(
        data.imageFile,
        process.env.CLOUDINARY_UPLOAD_PRESET_DRIVER || '',
      );

      if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        throw new Error('Failed to upload image to Cloudinary.');
      }

      imageUrl = cloudinaryResponse.secure_url;
    }

    const driver = await db.driver.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        imageUrl: imageUrl || undefined, // Use undefined to avoid overwriting with null
      },
    });

    return driver;
  } catch (error) {
    console.error('Error updating driver:', error);
    throw new Error('Failed to update driver.');
  }
}

// Delete a driver
export async function deleteDriver(id: string) {
  try {
    await db.driver.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw new Error('Failed to delete driver.');
  }
}
