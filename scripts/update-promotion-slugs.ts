import { PrismaClient } from '@prisma/client';
import { slugify } from '../lib/utils';

const prisma = new PrismaClient();

async function updatePromotionSlugs() {
  try {
    console.log('Starting to update promotion slugs...');

    // Get all existing promotions
    const promotions = await prisma.promotion.findMany();
    console.log(`Found ${promotions.length} promotions to update`);

    // Track existing slugs to ensure uniqueness
    const existingSlugs = new Set<string>();
    
    // Update each promotion with a proper slug
    for (const promotion of promotions) {
      // Generate slug from title
      let baseSlug = slugify(promotion.title || `promotion-${promotion.id}`);
      
      // Ensure it's not empty
      if (baseSlug === '') {
        baseSlug = `promotion-${promotion.id}`;
      }
      
      // Make sure slug is unique
      let slug = baseSlug;
      let counter = 1;
      
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      existingSlugs.add(slug);
      
      // Update the promotion
      await prisma.promotion.update({
        where: { id: promotion.id },
        data: { slug }
      });
      
      console.log(`Updated promotion ${promotion.id} with slug "${slug}"`);
    }

    console.log('Finished updating promotion slugs!');
  } catch (error) {
    console.error('Error updating promotion slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updatePromotionSlugs()
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 