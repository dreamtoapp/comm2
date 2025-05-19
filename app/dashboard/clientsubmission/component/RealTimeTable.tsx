'use client';
import { useState } from 'react';
// import dynamic from "next/dynamic";
// const Pusher = dynamic(() => import("pusher-js"), { ssr: false });
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
// import { usePusher } from "../../../../provider/pusherContext";

// Define the Submission type
export type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string; // Pre-formatted date string
};

// Props for RealTimeTable
type RealTimeTableProps = {
  initialSubmissions: Submission[]; // Define the type for the prop
};

export default function RealTimeTable({ initialSubmissions }: RealTimeTableProps) {
  const [submissions] = useState<Submission[]>(initialSubmissions); // Remove unused setSubmissions


  return (
    <div className='relative bg-background p-6 text-foreground'>
      {/* Title and Total Messages Count */}
      <div className='mb-4 text-right'>
        <h1 className='mb-2 text-2xl font-bold text-primary'>الرسائل الواردة</h1>
        <span className='font-medium text-muted-foreground'>
          إجمالي الرسائل: {submissions.length}
        </span>
      </div>

      {/* Table */}
      <Table>
        {/* Styled Table Header */}
        <TableHeader className='bg-muted/50'>
          <TableRow>
            <TableHead className='text-right font-bold text-muted-foreground'>الاسم</TableHead>
            <TableHead className='text-right font-bold text-muted-foreground'>
              البريد الإلكتروني
            </TableHead>
            <TableHead className='text-right font-bold text-muted-foreground'>الموضوع</TableHead>
            <TableHead className='text-right font-bold text-muted-foreground'>الرسالة</TableHead>
            <TableHead className='text-right font-bold text-muted-foreground'>
              تاريخ الاستلام
            </TableHead>
            <TableHead className='text-right font-bold text-muted-foreground'>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          <AnimatePresence>
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'} transition-colors hover:bg-muted/80`}
              >
                <TableCell className='text-right text-foreground'>{submission.name}</TableCell>
                <TableCell className='text-right text-foreground'>{submission.email}</TableCell>
                <TableCell className='text-right text-foreground'>{submission.subject}</TableCell>
                <TableCell className='line-clamp-2 text-right text-muted-foreground'>
                  {submission.message}
                </TableCell>
                <TableCell className='text-right text-muted-foreground'>
                  {submission.createdAt}
                </TableCell>
                <TableCell className='text-right'>
                  {/* Reply Button */}
                  <Button variant='outline' size='sm' className='w-full'>
                    رد
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
