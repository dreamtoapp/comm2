'use client';

import {
  startTransition,
  useEffect,
  useState,
} from 'react';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import {
  addToWishlist,
  isProductInWishlist,
  removeFromWishlist,
} from '@/app/(e-comm)/product/actions/actions';
import {
  cn,
  iconVariants,
} from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export default function WishlistButton({
  productId,
  className,
  size = 'md',
  showBackground = true,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const bgSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const result = await isProductInWishlist(productId);
        setIsInWishlist(result);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    checkWishlist();
  }, [productId]);

  const handleToggleWishlist = () => {
    if (isLoading) return;

    startTransition(() => {
      setIsLoading(true);
      const action = isInWishlist ? removeFromWishlist : addToWishlist;

      action(productId)
        .then((result) => {
          if (result.success) {
            setIsInWishlist(!isInWishlist);
          } else {
            toast.error(result.message || 'حدث خطأ');
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error('حدث خطأ أثناء تحديث المفضلة');
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading || isInitializing}
      className={cn(
        'relative flex items-center justify-center rounded-full transition-all duration-200',
        bgSize,
        isLoading && 'opacity-70',
        className,
      )}
      aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
    >
      {showBackground && (
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded-full bg-white/90 shadow-sm backdrop-blur-sm',
            isInWishlist && 'bg-red-50',
          )}
        />
      )}
      <span className="flex h-full w-full items-center justify-center">
        <Heart
          className={iconVariants({
            size,
            variant: isInWishlist ? 'destructive' : 'muted',
            animation: isLoading ? 'pulse' : undefined,
            className: cn(
              'transition-all duration-200',
              isInWishlist && 'fill-red-500',
            ),
          })}
          aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        />
      </span>
    </button>
  );
}



// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import { Heart } from 'lucide-react'; // Import directly
// import { toast } from 'sonner';

// import {
//   addToWishlist,
//   isProductInWishlist,
//   removeFromWishlist,
// } from '@/app/(e-comm)/product/[slug]/actions';
// // Removed Icon import: import { Icon } from '@/components/icons';
// import {
//   cn,
//   iconVariants,
// } from '@/lib/utils'; // Import CVA variants

// interface WishlistButtonProps {
//   productId: string;
//   className?: string;
//   size?: 'sm' | 'md' | 'lg';
//   showBackground?: boolean;
// }

// export default function WishlistButton({
//   productId,
//   className,
//   size = 'md',
//   showBackground = true,
// }: WishlistButtonProps) {
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitializing, setIsInitializing] = useState(true);

//   // Size is now handled directly by the Icon component

//   // Background size based on the size prop
//   const bgSize = {
//     sm: 'h-8 w-8',
//     md: 'h-10 w-10',
//     lg: 'h-12 w-12',
//   }[size];

//   // Check if the product is in the wishlist on component mount
//   useEffect(() => {
//     const checkWishlist = async () => {
//       try {
//         const result = await isProductInWishlist(productId);
//         setIsInWishlist(result);
//       } catch (error) {
//         console.error('Error checking wishlist:', error);
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     checkWishlist();
//   }, [productId]);

//   const handleToggleWishlist = async () => {
//     if (isLoading) return;

//     setIsLoading(true);

//     try {
//       if (isInWishlist) {
//         const result = await removeFromWishlist(productId);

//         if (result.success) {
//           setIsInWishlist(false);
//           toast.success(result.message);
//         } else {
//           toast.error(result.message);
//         }
//       } else {
//         const result = await addToWishlist(productId);

//         if (result.success) {
//           setIsInWishlist(true);
//           toast.success(result.message);
//         } else {
//           toast.error(result.message);
//         }
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//       toast.error('حدث خطأ أثناء تحديث المفضلة');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleToggleWishlist}
//       disabled={isLoading || isInitializing}
//       className={cn(
//         'relative flex items-center justify-center rounded-full transition-all duration-200', // Added rounded-full
//         bgSize, // Added bgSize
//         isLoading && 'opacity-70',
//         className,
//       )}
//       aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
//     >
//       {showBackground && (
//         <div
//           className={cn(
//             'absolute inset-0 -z-10 rounded-full bg-white/90 shadow-sm backdrop-blur-sm', // flex removed, bgSize removed
//             isInWishlist && 'bg-red-50',
//           )}
//         />
//       )}
//       {/* Wrapper span for better icon centering control */}
//       <span className="flex h-full w-full items-center justify-center"> {/* Added h-full w-full */}
//         <Heart // Use direct import + CVA
//           className={iconVariants({
//             size,
//             variant: isInWishlist ? 'destructive' : 'muted',
//             animation: isLoading ? 'pulse' : undefined,
//             className: cn(
//               'transition-all duration-200', // Removed relative and translate
//               isInWishlist && 'fill-red-500'
//             )
//           })}
//           aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'} // Use aria-label directly
//         />
//       </span>
//     </button>
//   );
// }
