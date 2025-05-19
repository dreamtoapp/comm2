// app/actions/terms-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

export type Term = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getTerms(): Promise<Term[]> {
  try {
    return await db.term.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    throw new Error('Failed to fetch terms');
  }
}

export async function createTerm(content: string): Promise<Term> {
  try {
    const newTerm = await db.term.create({
      data: { content },
    });
    revalidatePath('/terms');
    return newTerm;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to create term: ' + error.message);
    }
    throw new Error('Failed to create term');
  }
}

export async function updateTerm(id: string, content: string): Promise<Term> {
  try {
    const updatedTerm = await db.term.update({
      where: { id },
      data: { content },
    });
    revalidatePath('/terms');
    return updatedTerm;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to update term: ' + error.message);
    }
    throw new Error('Failed to update term');
  }
}

export async function deleteTerm(id: string): Promise<Term> {
  try {
    const deletedTerm = await db.term.delete({
      where: { id },
    });
    revalidatePath('/terms');
    return deletedTerm;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to delete term: ' + error.message);
    }
    throw new Error('Failed to delete term');
  }
}
