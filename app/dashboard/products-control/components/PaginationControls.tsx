import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // Generate page numbers for RTL (descending order)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = totalPages; i >= 1; i--) pages.push(i);
    } else {
      if (page >= totalPages - 3) {
        pages.push(
          totalPages,
          totalPages - 1,
          totalPages - 2,
          totalPages - 3,
          totalPages - 4,
          '...',
          1,
        );
      } else if (page <= 4) {
        pages.push(totalPages, '...', 5, 4, 3, 2, 1);
      } else {
        pages.push(totalPages, '...', page + 1, page, page - 1, '...', 1);
      }
    }
    return pages;
  };

  return (
    <Pagination dir='rtl'>
      <PaginationContent>
        <PaginationItem>
          <button
            type='button'
            onClick={() => page < totalPages && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            التالي &larr;
          </button>
        </PaginationItem>
        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <PaginationItem key={p}>
              <PaginationLink
                href='#'
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  if (p !== page) onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={'ellipsis-' + idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <button
            type='button'
            onClick={() => page > 1 && onPageChange(page - 1)}
            disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          >
            &rarr; السابق
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
