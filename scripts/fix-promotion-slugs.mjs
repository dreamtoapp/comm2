// Use .mjs extension for Node.js ES modules
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper function to slugify text
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and dashes)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

async function fixPromotionSlugs() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to the database');
    
    // Extract database name from connection string
    const dbName = uri.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    const promotionCollection = db.collection('Promotion');
    
    // Find all promotions
    const promotions = await promotionCollection.find({}).toArray();
    console.log(`Found ${promotions.length} promotions to update`);

    const existingSlugs = new Set();
    
    // Update each promotion with a proper slug
    for (const promotion of promotions) {
      // Generate basic slug from title
      let baseSlug = slugify(promotion.title || `promotion-${promotion._id}`);
      
      // Ensure it's not empty
      if (baseSlug === '') {
        baseSlug = `promotion-${promotion._id}`;
      }
      
      // Make sure slug is unique
      let slug = baseSlug;
      let counter = 1;
      
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      existingSlugs.add(slug);
      
      // Update the promotion directly in MongoDB
      await promotionCollection.updateOne(
        { _id: promotion._id },
        { $set: { slug: slug } }
      );
      
      console.log(`Updated promotion ${promotion._id} with slug "${slug}"`);
    }

    console.log('Finished updating promotion slugs!');
  } catch (error) {
    console.error('Error fixing promotion slugs:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the function
fixPromotionSlugs().catch(console.error); 