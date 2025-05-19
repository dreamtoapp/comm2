'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Type for cart item
type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Get cart from cookies or create a new one
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart');

  if (!cartCookie?.value) {
    return [];
  }

  try {
    return JSON.parse(cartCookie.value) as CartItem[];
  } catch (error) {
    console.error('Error parsing cart cookie:', error);
    return [];
  }
}

// Add item to cart
export async function addToCart(item: {
  productId: string;
  name: string;
  price: number;
  image: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Get current cart
    const cart = await getCart();

    // Check if product is already in cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.productId === item.productId);

    if (existingItemIndex >= 0) {
      // Increment quantity if product already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1
      cart.push({
        id: `${Date.now()}-${item.productId}`,
        ...item,
        quantity: 1,
      });
    }

    // Save cart to cookies
    const cookieStore = await cookies();
    cookieStore.set('cart', JSON.stringify(cart), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Revalidate cart page
    revalidatePath('/cart');

    return {
      success: true,
      message: 'تمت إضافة المنتج إلى السلة',
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة المنتج إلى السلة',
    };
  }
}

// Remove item from cart
export async function removeFromCart(
  itemId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Get current cart
    const cart = await getCart();

    // Filter out the item to remove
    const newCart = cart.filter((item) => item.id !== itemId);

    // Save cart to cookies
    const cookieStore = await cookies();
    cookieStore.set('cart', JSON.stringify(newCart), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Revalidate cart page
    revalidatePath('/cart');

    return {
      success: true,
      message: 'تمت إزالة المنتج من السلة',
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إزالة المنتج من السلة',
    };
  }
}

// Update item quantity in cart
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<{ success: boolean; message: string }> {
  try {
    // Get current cart
    const cart = await getCart();

    // Find the item to update
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        message: 'المنتج غير موجود في السلة',
      };
    }

    // Update quantity
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }

    // Save cart to cookies
    const cookieStore = await cookies();
    cookieStore.set('cart', JSON.stringify(cart), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Revalidate cart page
    revalidatePath('/cart');

    return {
      success: true,
      message: 'تم تحديث الكمية',
    };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الكمية',
    };
  }
}

// Clear cart
export async function clearCart(): Promise<{ success: boolean; message: string }> {
  try {
    // Set empty cart in cookies
    const cookieStore = await cookies();
    cookieStore.set('cart', '[]', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Revalidate cart page
    revalidatePath('/cart');

    return {
      success: true,
      message: 'تم تفريغ السلة',
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تفريغ السلة',
    };
  }
}
