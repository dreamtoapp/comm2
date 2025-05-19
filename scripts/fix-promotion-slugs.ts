import { PrismaClient } from '@prisma/client';
// If slugify is not available, define a fallback slugify function
import { slugify } from '../lib/utils';
// fallback slugify if not imported
// function slugify(str: string): string {
//   return str
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '')
//     .replace(/--+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }

const prisma = new PrismaClient();

async function fixPromotionSlugs() {
  try {
    console.log('Starting to fix promotion slugs...');

    // Get all promotions 
    const promotions = await prisma.promotion.findMany({
      select: {
        id: true,
        title: true
      }
    });
    
    console.log(`Found ${promotions.length} promotions to update`);

    // Update each promotion with a proper slug
    for (const promotion of promotions) {
      // Generate basic slug from title
      let slug = slugify(promotion.title || `promotion-${promotion.id}`);
      
      // Ensure it's not empty
      if (slug === '') {
        slug = `promotion-${promotion.id}`;
      }
      
      // Check if the slug already exists
      const existingWithSlug = await prisma.promotion.findFirst({
        where: {
          slug: slug,
          id: { not: promotion.id }
        }
      });
      
      // Append ID if duplicate
      if (existingWithSlug) {
        slug = `${slug}-${promotion.id.substring(0, 6)}`;
      }

      // Update the promotion using Prisma's update method for MongoDB compatibility
      await prisma.promotion.update({
        where: { id: promotion.id },
        data: { slug },
      });
      
      console.log(`Updated promotion ${promotion.id} with slug "${slug}"`);
    }

    console.log('Finished updating promotion slugs!');
  } catch (error) {
    console.error('Error fixing promotion slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
fixPromotionSlugs().catch(console.error); 