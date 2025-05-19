'use client';

import {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { getProductsForSelect } from '@/app/dashboard/products/actions'; // Import the server action
import type {
  PaginatedProductsResponse,
  SelectableProduct,
} from '@/app/dashboard/products/actions/get-products-for-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialSelectedProductIds?: string[]; // Still useful for pre-selecting based on IDs if editing
  onProductsSelected: (selectedProducts: SelectableProduct[]) => void; // Changed to return full objects
  // allProducts prop removed, modal will fetch its own data
}

const DEBOUNCE_DELAY = 500; // ms

export default function ProductSelectorModal({
  isOpen,
  onOpenChange,
  initialSelectedProductIds = [],
  onProductsSelected,
}: ProductSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState(''); // Actual input value
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced value for API calls
  const [currentSelectedIds, setCurrentSelectedIds] = useState<Set<string>>(new Set(initialSelectedProductIds));
  const [productsToList, setProductsToList] = useState<SelectableProduct[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const loadProducts = useCallback(async (currentPage: number, query: string) => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const response: PaginatedProductsResponse = await getProductsForSelect({
        query: query,
        page: currentPage,
      });
      startTransition(() => {
        setProductsToList(prevProducts => currentPage === 1 ? response.products : [...prevProducts, ...response.products]);
        setHasMoreProducts(response.hasMore);
        setPage(currentPage);
      });
    } catch (error) {
      console.error("Failed to load products:", error);
      // Optionally show a toast or error message
      setHasMoreProducts(false); // Stop trying to load more on error
    } finally {
      setIsLoading(false);
    }
  }, [isOpen]);

  // Effect for debouncing search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Effect for fetching products when modal opens or debounced search term changes
  useEffect(() => {
    if (isOpen) {
      setProductsToList([]); // Reset list when search term changes or modal re-opens
      setPage(1); // Reset page
      setHasMoreProducts(true); // Assume there are more products initially
      loadProducts(1, debouncedSearchTerm);
    } else {
      // Reset when modal closes
      setProductsToList([]);
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setPage(1);
      setHasMoreProducts(true);
    }
  }, [isOpen, debouncedSearchTerm, loadProducts]);

  // Reset selected IDs when initialSelectedProductIds change (e.g. editing different promotion)
  useEffect(() => {
    setCurrentSelectedIds(new Set(initialSelectedProductIds));
  }, [initialSelectedProductIds]); // Keep this to initialize selection by ID if editing

  // When initialSelectedProductIds are provided (e.g. editing a promotion),
  // we might not have the full product objects yet if the modal hasn't fetched them.
  // The selection is by ID, and names/details will appear as products load.

  // Client-side filtering on the currently loaded list (optional, can be removed if server search is sufficient)
  // For now, this will filter the `productsToList` which is already paginated/searched from server.
  // If we want instant filtering as user types, before debounced search, this is useful.
  // However, the `debouncedSearchTerm` is what drives the API call.
  // Let's simplify and rely on server search primarily. The `productsToList` will be the source.
  // const filteredProducts = productsToList; // No additional client-side filtering for now

  const handleToggleProduct = (productId: string) => {
    setCurrentSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selectedProductObjects = productsToList.filter(p => currentSelectedIds.has(p.id));
    // If some initialSelectedProductIds are not in productsToList (e.g. not yet loaded),
    // we might only have their IDs. For simplicity now, we only confirm what's loaded and selectable.
    // A more robust solution might involve fetching details for any initial IDs not in productsToList.
    // For now, this confirms based on what's visible and selectable in the modal.
    onProductsSelected(selectedProductObjects);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>اختيار المنتجات للعرض</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            type="search"
            placeholder="البحث عن منتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-[300px] border rounded-md p-2">
            {isLoading && productsToList.length === 0 && <p className="text-center text-muted-foreground">جارٍ تحميل المنتجات...</p>}
            {!isLoading && productsToList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {debouncedSearchTerm ? 'لم يتم العثور على منتجات تطابق بحثك.' : 'لا توجد منتجات لعرضها أو ابدأ البحث.'}
              </p>
            )}
            {productsToList.length > 0 && (
              <div className="space-y-2">
                {productsToList.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={currentSelectedIds.has(product.id)}
                        onCheckedChange={() => handleToggleProduct(product.id)}
                      />
                      <label htmlFor={`product-${product.id}`} className="text-sm font-medium cursor-pointer">
                        {product.name}
                      </label>
                    </div>
                    {product.price !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {product.price.toLocaleString('ar-EG')} ر.س
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {hasMoreProducts && !isLoading && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadProducts(page + 1, debouncedSearchTerm)}
                >
                  تحميل المزيد
                </Button>
              </div>
            )}
            {isLoading && productsToList.length > 0 && <p className="text-center text-xs text-muted-foreground mt-2">جارٍ تحميل المزيد...</p>}
          </ScrollArea>
          <p className="text-xs text-muted-foreground">
            تم اختيار {currentSelectedIds.size} منتج.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button type="button" onClick={handleConfirm} disabled={isLoading}>
            تأكيد الاختيار
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              إلغاء
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
