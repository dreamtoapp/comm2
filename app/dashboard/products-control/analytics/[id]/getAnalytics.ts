'use server';
import { Prisma } from '@prisma/client';
import db from '@/lib/prisma';

export async function getProductAnalytics(productId: string, dateFrom?: string, dateTo?: string) {
  const productInfo = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      price: true,
      costPrice: true,
      outOfStock: true,
      supplierId: true,
      published: true,
      type: true,
      createdAt: true,
      slug: true,
      details: true,
      size: true,
      updatedAt: true,
      productCode: true,
      gtin: true,
      brand: true,
      material: true,
      color: true,
      dimensions: true,
      weight: true,
      features: true,
      requiresShipping: true,
      stockQuantity: true,
      manageInventory: true,
      compareAtPrice: true, // Added
      tags: true,           // Added
      metaTitle: true,      // Added
      metaDescription: true,// Added
      // Also check for shippingDays, returnPeriodDays, hasQualityGuarantee, careInstructions
      // if they are used in the finalProduct mapping and exist in Prisma model
      shippingDays: true,
      returnPeriodDays: true,
      hasQualityGuarantee: true,
      careInstructions: true,
      images: true, // For finalProduct mapping
    },
  });

  if (!productInfo) {
    return null;
  }

  let supplier = null;
  if (productInfo.supplierId) {
    supplier = await db.supplier.findUnique({
      where: { id: productInfo.supplierId },
      select: { name: true },
    });
  }

  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;

  const orderItemWhereBase: Prisma.OrderItemWhereInput = { productId };
  const orderWhereDateFilter: Prisma.OrderWhereInput = {};
  const reviewWhereDateFilter: Prisma.ReviewWhereInput = {};

  if (fromDate && toDate) {
    const toDateEndOfDay = new Date(toDate);
    toDateEndOfDay.setHours(23, 59, 59, 999);
    orderWhereDateFilter.createdAt = { gte: fromDate, lte: toDateEndOfDay };
    orderItemWhereBase.order = orderWhereDateFilter;
    reviewWhereDateFilter.createdAt = { gte: fromDate, lte: toDateEndOfDay };
  }

  const orderItems = await db.orderItem.findMany({
    where: orderItemWhereBase,
    include: {
      order: {
        select: {
          id: true,
          customerId: true,
          createdAt: true,
          customerName: true,
          status: true,
          orderNumber: true,
        },
      },
    },
  });

  const totalRevenue = orderItems.reduce((sum, oi) => sum + oi.quantity * (oi.price || 0), 0);
  const uniqueOrderIds = new Set(orderItems.map(oi => oi.orderId));
  const totalUniqueOrders = uniqueOrderIds.size;
  const uniqueCustomerIds = new Set(orderItems.map(oi => oi.order?.customerId).filter(Boolean));
  const totalUniqueCustomers = uniqueCustomerIds.size;

  const revenueByMonthData: { [month: string]: number } = {};
  orderItems.forEach(oi => {
    if (oi.order?.createdAt) {
      const monthYear = new Date(oi.order.createdAt).toLocaleString('default', { year: 'numeric', month: '2-digit' });
      const itemRevenue = oi.quantity * (oi.price || 0);
      revenueByMonthData[monthYear] = (revenueByMonthData[monthYear] || 0) + itemRevenue;
    }
  });
  const salesByMonth = Object.entries(revenueByMonthData).map(([month, sales]) => ({ month, sales }));
  salesByMonth.sort((a, b) => {
    const [aYearStr, aMonthStr] = a.month.split('-');
    const [bYearStr, bMonthStr] = b.month.split('-');
    const aYear = parseInt(aYearStr);
    const aMonth = parseInt(aMonthStr);
    const bYear = parseInt(bYearStr);
    const bMonth = parseInt(bMonthStr);
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  });

  const orderHistory = orderItems.map(oi => ({
    id: oi.id,
    quantity: oi.quantity,
    price: oi.price,
    orderId: oi.orderId,
    order: oi.order ? {
      createdAt: oi.order.createdAt,
      customerName: oi.order.customerName,
      status: oi.order.status,
      orderNumber: oi.order.orderNumber,
    } : null,
  }));

  const reviewWhere: Prisma.ReviewWhereInput = { productId, ...reviewWhereDateFilter };
  const reviews = await db.review.findMany({
    where: reviewWhere,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

  // Single, correct declaration of reviewsList
  const reviewsList = reviews.map(review => ({
    id: review.id,
    user: review.user?.name || 'مستخدم غير معروف',
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
  }));

  // Determine activity start and end dates
  let activityStartDate: Date = productInfo.createdAt;
  let activityEndDate: Date = new Date(); // Default end to today

  const orderDates = orderItems.map(oi => oi.order?.createdAt).filter(Boolean).map(d => new Date(d!));
  const reviewDatesNonFiltered = await db.review.findMany({
    where: { productId },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  const allPossibleActivityTimestamps = [productInfo.createdAt.getTime()];
  orderDates.forEach(d => allPossibleActivityTimestamps.push(d.getTime()));
  if (reviewDatesNonFiltered.length > 0) {
    allPossibleActivityTimestamps.push(new Date(reviewDatesNonFiltered[0].createdAt).getTime());
  }

  if (allPossibleActivityTimestamps.length > 0) { // Check if array is not empty before calling Math.min/max
    activityStartDate = new Date(Math.min(...allPossibleActivityTimestamps));
    // If there are orders or reviews, set activityEndDate to the latest of those.
    if (orderDates.length > 0 || reviewDatesNonFiltered.length > 0) {
      const latestOrderOrReviewTimestamp = Math.max(
        ...(orderDates.map(d => d.getTime())),
        ...(reviewDatesNonFiltered.map(d => new Date(d.createdAt).getTime()))
      );
      const potentialEndDate = new Date(latestOrderOrReviewTimestamp);
      activityEndDate = potentialEndDate > productInfo.createdAt ? potentialEndDate : productInfo.createdAt;
    } else {
      // No orders or reviews, end date is today, but not before product creation.
      activityEndDate = new Date() > productInfo.createdAt ? new Date() : productInfo.createdAt;
    }
  }

  // Ensure endDate is not before startDate
  if (activityEndDate < activityStartDate) {
    activityEndDate = activityStartDate;
  }

  // Explicitly map fields to match ProductType from types/product.ts, converting null to undefined for optional strings
  const finalProduct = {
    id: productInfo.id,
    name: productInfo.name,
    slug: productInfo.slug,
    price: productInfo.price,
    compareAtPrice: productInfo.compareAtPrice, // Already number | null
    costPrice: productInfo.costPrice,           // Already number | null
    size: productInfo.size ?? undefined,
    details: productInfo.details ?? undefined, // Convert null to undefined
    imageUrl: productInfo.imageUrl ?? undefined, // Convert null to undefined
    images: productInfo.images, // Already string[]
    type: productInfo.type,
    supplier: productInfo.supplierId && supplier ? { id: productInfo.supplierId, name: supplier.name } : null, // Matches simplified supplier in ProductType
    supplierId: productInfo.supplierId,
    productCode: productInfo.productCode ?? undefined,
    gtin: productInfo.gtin ?? undefined,
    material: productInfo.material ?? undefined,
    brand: productInfo.brand ?? undefined,
    color: productInfo.color ?? undefined,
    dimensions: productInfo.dimensions ?? undefined,
    weight: productInfo.weight ?? undefined,
    features: productInfo.features,
    requiresShipping: productInfo.requiresShipping,
    shippingDays: productInfo.shippingDays ?? undefined,
    returnPeriodDays: productInfo.returnPeriodDays,
    hasQualityGuarantee: productInfo.hasQualityGuarantee,
    careInstructions: productInfo.careInstructions ?? undefined,
    published: productInfo.published,
    outOfStock: productInfo.outOfStock,
    manageInventory: productInfo.manageInventory,
    stockQuantity: productInfo.stockQuantity, // Already number | null
    // rating: productInfo.rating, // Already number | null - this is calculated later for analytics
    // reviewCount: productInfo.reviewCount, // Calculated later
    // reviews: [], // Populated by analytics logic
    // wishlistedBy: [], // Not relevant for this analytics object
    // categoryAssignments: [], // Not typically part of basic product info for analytics display
    tags: productInfo.tags, // Already string[]
    metaTitle: productInfo.metaTitle ?? undefined,
    metaDescription: productInfo.metaDescription ?? undefined,
    // translations: [], // Not relevant here
    createdAt: productInfo.createdAt,
    updatedAt: productInfo.updatedAt,
    // Ensure all fields from ProductType in types/product.ts are covered
    // and that their types match (especially null vs undefined for optional strings)
  };

  let totalCOGS = 0;
  if (productInfo.costPrice !== null && productInfo.costPrice !== undefined) {
    const totalQuantitySold = orderItems.reduce((sum, oi) => sum + oi.quantity, 0);
    totalCOGS = totalQuantitySold * productInfo.costPrice;
  }
  const totalProfit = totalRevenue - totalCOGS;
  const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    product: finalProduct,
    totalRevenue: totalRevenue,
    totalOrders: totalUniqueOrders,
    totalCustomers: totalUniqueCustomers,
    salesByMonth: salesByMonth,
    orderHistory: orderHistory,
    reviews: {
      list: reviewsList,
      average: parseFloat(averageRating.toFixed(1)),
      count: totalReviews,
    },
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    averageProfitMargin: parseFloat(averageProfitMargin.toFixed(2)),
    activityStartDate: activityStartDate.toISOString().split('T')[0],
    activityEndDate: activityEndDate.toISOString().split('T')[0],
  };
}
