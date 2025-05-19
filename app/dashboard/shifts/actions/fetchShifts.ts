'use server';
import db from '@/lib/prisma';
import { Shift } from '@/types/shift';

export async function fetchShifts(): Promise<Shift[]> {
  try {
    const shifts = await db.shift.findMany();
    return shifts;
  } catch (error) {
    console.error('Error fetching shifts:', error);
    throw new Error('Failed to fetch shifts.');
  }
}
