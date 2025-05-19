const { PrismaClient } = require('@prisma/client');
const { ObjectId } = require('mongodb');
const { OrderStatus } = require('../constant/order-status');

const prisma = new PrismaClient();

// Helper function to generate MongoDB ObjectId
function generateObjectId() {
  return new ObjectId().toString();
}

async function main() {
  console.warn('Starting test rating script...');

  // 1. Find a random product to rate
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (products.length === 0) {
    console.warn('No products found to rate');
    return;
  }

  const product = products[0];
  console.warn(`Selected product: ${product.name} (${product.id})`);

  // 2. Find or create a test user
  let user = await prisma.user.findFirst({
    where: {
      email: 'test-user@example.com',
    },
  });

  if (!user) {
    console.warn('Creating test user...');
    user = await prisma.user.create({
      data: {
        id: generateObjectId(),
        name: 'مستخدم اختبار',
        email: 'test-user@example.com',
        emailVerified: new Date(),
        image: 'https://ui-avatars.com/api/?name=Test+User&background=random',
      },
    });
  }

  console.warn(`Using test user: ${user.name} (${user.id})`);

  // 3. Create a test order to verify purchase
  const existingOrder = await prisma.order.findFirst({
    where: {
      customerId: user.id,
      status: 'Delivered',
      items: {
        some: {
          productId: product.id,
        },
      },
    },
    include: {
      items: true,
    },
  });

  if (!existingOrder) {
    console.warn('Creating test order...');
    await prisma.order.create({
      data: {
        id: generateObjectId(),
        customerId: user.id,
        status: 'Delivered',
        totalAmount: product.price,
        items: {
          create: {
            id: generateObjectId(),
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        },
      },
    });
    console.warn('Test order created successfully');
  } else {
    console.warn('Test order already exists');
  }

  // 4. Create or update a review
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: user.id,
      productId: product.id,
    },
  });

  const rating = Math.floor(Math.random() * 5) + 1; // Random rating between 1-5
  const comment = `هذا تقييم اختباري للمنتج. أعطيه ${rating} نجوم من أصل 5. المنتج جيد جداً ويستحق الشراء.`;

  if (existingReview) {
    console.warn('Updating existing review...');
    await prisma.review.update({
      where: {
        id: existingReview.id,
      },
      data: {
        rating,
        comment,
        updatedAt: new Date(),
      },
    });
  } else {
    console.warn('Creating new review...');
    await prisma.review.create({
      data: {
        id: generateObjectId(),
        userId: user.id,
        productId: product.id,
        rating,
        comment,
        isVerified: true,
      },
    });
  }

  // 5. Update product rating
  const reviews = await prisma.review.findMany({
    where: {
      productId: product.id,
    },
    select: {
      rating: true,
    },
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  });

  console.warn(`Review created/updated with rating: ${rating}`);
  console.warn(`Product average rating updated to: ${averageRating.toFixed(2)}`);
  console.warn('Test completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error in test script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
