'use client';
import React, { useState } from 'react';

import { Edit } from 'lucide-react';
import { toast } from 'sonner';

import { User } from '@/types/user';

import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { getUserToUpdate, updateUserData } from '../action/actions';

function EditUser({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const getUser = async (userId: string) => {
    setLoading(true);
    try {
      const userData = await getUserToUpdate(userId); // Fetch user
      setUser(userData); // Set user state
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center gap-2'
          onClick={() => {
            getUser(userId);
            setIsDialogOpen(true);
          }}
        >
          <span>تعديل</span>
          <Edit size={20} color='blue' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل المستخدم</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='space-y-4'>
            <div className='h-8 w-3/4 animate-pulse rounded bg-gray-300'></div>
            <div className='h-8 w-1/2 animate-pulse rounded bg-gray-300'></div>
            <div className='h-8 w-full animate-pulse rounded bg-gray-300'></div>
            <div className='h-8 w-2/3 animate-pulse rounded bg-gray-300'></div>
          </div>
        ) : (
          user && <EditUserForm user={user} onClose={handleDialogClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditUser;

function EditUserForm({ user, onClose }: { user: User; onClose: () => void }) {
  const [saving, setSaving] = useState<boolean>(false);

  const handleEditSave = async (formData: FormData) => {
    setSaving(true);
    try {
      const response = await updateUserData(formData);
      toast.success(response.msg || 'تم الحفظ بنجاح');
      onClose(); // Close the dialog after saving
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form action={handleEditSave}>
      <ScrollArea className='h-[400px] pr-4' dir='rtl'>
        <div className='space-y-2 px-4 py-2'>
          <Input name='id' defaultValue={user.id} type='hidden' required />
          <Input name='role' defaultValue={'customer'} type='hidden' required />
          <div>
            <label>الجوال</label>
            <Input
              name='phone'
              defaultValue={user.phone || ''}
              maxLength={10}
              minLength={10}
              type='tel'
              placeholder='رقم الجوال'
              pattern='[0-9]*'
              required
            />
          </div>
          <div>
            <label>الاسم</label>
            <Input name='name' defaultValue={user.name || ''} required />
          </div>
          <div>
            <label>الإيميل</label>
            <Input name='email' defaultValue={user.email || ''} type='email' />
          </div>
          <div>
            <label>العنوان</label>
            <Input name='address' defaultValue={user.address || ''} />
          </div>

          <div className='flex items-center justify-between gap-2'>
            <div>
              <label>خط العرض</label>
              <Input name='latitude' defaultValue={user.latitude || ''} />
            </div>
            <div>
              <label>خط الطول</label>
              <Input name='longitude' defaultValue={user.longitude || ''} />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className='mt-4 flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onClose}>
          إلغاء
        </Button>
        <Button type='submit' disabled={saving}>
          {saving ? 'جارٍ الحفظ...' : 'حفظ'}
        </Button>
      </div>
    </form>
  );
}
