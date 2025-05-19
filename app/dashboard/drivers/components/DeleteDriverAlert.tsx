// app/dashboard/drivers/components/DeleteDriverAlert.tsx
'use client'; // Mark as a Client Component

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { deleteDriver } from '../actions/Actions';

interface DeleteDriverAlertProps {
  driverId: string;
  children: React.ReactNode;
}

export default function DeleteDriverAlert({ driverId, children }: DeleteDriverAlertProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDriver(driverId); // Call the server action to delete the driver
      window.location.reload(); // Refresh the page after deletion
    } catch (e) {
      let errorMessage = 'Failed to delete driver.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error deleting driver:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      {/* Trigger for opening the alert */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      {/* Alert Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The driver will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
