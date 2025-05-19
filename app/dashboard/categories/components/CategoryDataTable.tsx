'use client'

import { useState } from 'react';

import {
  Edit,
  Eye,
  MoreHorizontal,
  // PlusCircle, // No longer needed for "Add Subcategory"
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeleteCategoryDialog from './DeleteCategoryDialog';

// Define Category type locally based on prisma schema for this component's needs
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  // parentId removed for single-level system
  createdAt: Date;
  updatedAt: Date;
}

// Extend Category type to include _count (productAssignments only)
interface CategoryWithCounts extends Category {
  _count: {
    productAssignments: number;
  };
  // parent relation removed
}

interface CategoryDataTableProps {
  categories: CategoryWithCounts[];
}

export default function CategoryDataTable({ categories }: CategoryDataTableProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCounts | null>(null);

  const handleDeleteClick = (category: CategoryWithCounts) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-right">صورة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الاسم اللطيف</TableHead>
              <TableHead className="text-center">المنتجات</TableHead>
              <TableHead className="text-right w-[100px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">لم يتم العثور على أصناف.</TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="rounded-sm object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-muted rounded-sm flex items-center justify-center text-muted-foreground">
                      <Eye size={24} /> {/* Placeholder icon */}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{category.slug}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={category._count.productAssignments > 0 ? "default" : "secondary"}>
                    {category._count.productAssignments}
                  </Badge>
                </TableCell>
                <TableCell className="text-left"> {/* Actions - Adjusted for RTL */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start"> {/* Adjusted for RTL */}
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/categories/edit/${category.id}`} className="flex items-center w-full">
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/categories/view/${category.slug}`} className="flex items-center w-full">
                          <Eye className="ml-2 h-4 w-4" />
                          عرض المنتجات
                        </Link>
                      </DropdownMenuItem>
                      {/* "Add Subcategory" option removed */}
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(category)}
                        className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50 flex items-center w-full"
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedCategory && (
        <DeleteCategoryDialog
          category={selectedCategory} // This should now match the updated Category type in DeleteCategoryDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
