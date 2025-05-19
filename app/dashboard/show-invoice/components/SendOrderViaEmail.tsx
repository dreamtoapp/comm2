'use client';
import React, { useState } from 'react';

import { toast } from 'sonner';

import { sendInvoiceEmail } from '@/app/dashboard/show-invoice/actions/sendInvoiceEmail';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

{
}

function SendOrderViaEmail({
  invoiceNumber,
  orderId,
  email,
}: {
  invoiceNumber: string;
  orderId: string;
  email: string;
}) {
  const [ccEmail, setCcEmail] = useState<string>('');
  // const order = null // Remove unused variable

  const handleSendInvoice = async () => {
    toast.info('جارٍ إرسال الفاتورة...');
    try {
      // const pdfBlob = await generateInvoicePDF(order);
      await sendInvoiceEmail({
        to: email,
        cc: ccEmail || undefined, // Add CC email if provided
        orderNumber: invoiceNumber,
        orderId: orderId,
      });
      toast.success('تم إرسال الفاتورة بنجاح!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('فشل في إرسال الفاتورة.');
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-full rounded-md bg-green-600 px-4 py-2 text-white'>
            إرسال الفاتورة عبر البريد الإلكتروني
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className='mt-5'>
            <DialogTitle className='text-right'>
              تأكيد إرسال الفاتورة رقم : {invoiceNumber}
            </DialogTitle>
            <DialogDescription className='text-right'>
              {/* Removed reference to order?.customerEmail */}
              هل أنت متأكد أنك تريد إرسال الفاتورة؟ يمكنك أيضًا إضافة بريد
              إلكتروني في خانة النسخة الكربونية أدناه.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              type='email'
              placeholder='البريد الإلكتروني للنسخة الكربونية (اختياري)'
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
            />
          </div>

          <div className='mt-5 flex w-full flex-col items-start justify-between space-y-3'>
            <div className='w-full'>
              <p className='text-sm font-medium text-gray-700'>
                سيتم إرسال الفاتورة إلى البريد الإلكتروني:
              </p>
              <p className='mt-1 rounded-md bg-gray-100 px-2 py-1 text-sm text-green-600'>
                {email}
              </p>
            </div>
            <div className='w-full'>
              <p className='text-sm font-medium text-gray-700'>نسخة كربونية إلى:</p>
              <p className='mt-1 rounded-md bg-gray-100 px-2 py-1 text-sm text-green-600'>
                {ccEmail || 'لا يوجد بريد إلكتروني مضاف'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSendInvoice}
              className='w-full rounded-md bg-green-600 px-4 py-2 text-white'
            >
              تأكيد وإرسال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SendOrderViaEmail;
