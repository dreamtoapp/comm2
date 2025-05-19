'use client';

import React, {
  useEffect,
  useState,
} from 'react';
import { useFormStatus } from 'react-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

import { assignDriver } from '../actions/assign-driver';
import { getDrivers } from '../actions/get-drivers';

interface DriverSelectionProps {
  orderId: string;
  currentDriverId?: string;
}

export default function AssignToDriver({ orderId, currentDriverId }: DriverSelectionProps) {
  const [open, setOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(currentDriverId || '');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { pending } = useFormStatus();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const driverList = await getDrivers();
        setDrivers(driverList);
      } catch (error) {
        console.error("فشل في جلب قائمة السائقين:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleAssignDriver = async () => {
    if (!selectedDriverId) return;

    try {
      setLoading(true);
      // Call your API to assign the driver here
      await assignDriver(orderId, selectedDriverId);
    } catch (error) {
      console.error("فشل في تعيين السائق:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          {currentDriverId ? 'تغيير السائق' : 'تعيين سائق'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>تعيين سائق للطلب</AlertDialogTitle>
          <AlertDialogDescription>
            اختر سائقًا من القائمة أدناه لتعيينه لهذا الطلب.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 " >
          {loading ? (
            <p className="text-sm text-muted-foreground">جاري تحميل السائقين...</p>
          ) : drivers.length > 0 ? (
            <RadioGroup
              defaultValue={selectedDriverId}
              onValueChange={setSelectedDriverId}
              className="space-y-2"
            >
              {drivers.map((driver) => (
                <Label
                  key={driver.id}
                  htmlFor={driver.id}
                  className="flex items-center space-x-2 w-full bg-secondary gap-2 h-20 px-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-all duration-150 shadow-sm border border-border"
                  dir="rtl"
                >
                  <RadioGroupItem value={driver.id} id={driver.id} className="pointer-events-none" />
                  <Avatar className="h-12 w-12 border border-primary/30 shadow-sm">
                    <AvatarImage src={driver.imageUrl || '/fallback/driver-fallback.png'} alt={driver.name} />
                    <AvatarFallback>{driver.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate text-base text-foreground">{driver.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{driver.phone}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-sm text-destructive">لا يوجد سائقين متاحين حاليًا.</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending || !selectedDriverId}
            onClick={handleAssignDriver}
          >
            {pending ? 'جاري التعيين...' : 'تعيين'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
