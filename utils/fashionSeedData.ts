import { ORDER_STATUS } from '@/constant/order-status';
import { faker } from '@faker-js/faker/locale/ar'; // Use Arabic locale
import {
  DiscountType,
  Product,
  PromotionType,
} from '@prisma/client';

import {
  generateOrderNumber,
} from '../app/(e-comm)/checkout/helpers/orderNumber';
import db from '../lib/prisma';
import { Slugify } from './slug';

// Create multiple fashion suppliers for more realistic data
async function createFashionSuppliers() {
  const suppliers = [
    {
      name: 'Fashion Arabia',
      slug: 'fashion-arabia',
      logo: '/fallback/product-fallback.avif',
      email: 'contact@fashionarabia.com',
      phone: '+966500000000',
      address: 'Riyadh, Saudi Arabia',
      type: 'company',
    },
    {
      name: 'Elegance Boutique',
      slug: 'elegance-boutique',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80',
      email: 'info@eleganceboutique.com',
      phone: '+966511111111',
      address: 'Jeddah, Saudi Arabia',
      type: 'boutique',
    },
    {
      name: 'Urban Style',
      slug: 'urban-style',
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80',
      email: 'support@urbanstyle.com',
      phone: '+966522222222',
      address: 'Dammam, Saudi Arabia',
      type: 'company',
    },
    {
      name: 'Luxury Trends',
      slug: 'luxury-trends',
      logo: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80',
      email: 'hello@luxurytrends.com',
      phone: '+966533333333',
      address: 'Mecca, Saudi Arabia',
      type: 'premium',
    },
  ];

  const createdSuppliers = [];
  for (const supplier of suppliers) {
    // Create the main supplier
    const createdSupplier = await db.supplier.create({
      data: {
        ...supplier,
        // Add translations for each supplier
        translations: {
          create: [
            {
              languageCode: 'ar-SA',
              name: supplier.name + ' (عربي)',
              address: supplier.address + ' (عربي)',
            },
            {
              languageCode: 'en',
              name: supplier.name,
              address: supplier.address,
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });
    createdSuppliers.push(createdSupplier);
  }

  log(`Created ${createdSuppliers.length} fashion suppliers with translations`);
  return createdSuppliers;
}

// High-quality fashion product images from Unsplash - expanded collection
const fashionImages = {
  menClothing: [
    // Formal Wear
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80', // Men's Suit
    'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&q=80', // Formal Shirt
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80', // Dress Pants
    'https://images.unsplash.com/photo-1594938374182-a57061dba5a3?w=500&q=80', // Blazer
    'https://images.unsplash.com/photo-1611505908502-5b67e53e3a76?w=500&q=80', // Tie

    // Casual Wear
    'https://images.unsplash.com/photo-1618001789159-ffffe6f96ef2?w=500&q=80', // Casual Shirt
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80', // Premium T-shirt
    'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=500&q=80', // Jeans
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', // Jacket
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80', // Hoodie

    // Sportswear
    'https://images.unsplash.com/photo-1581612129334-551ccd2c6a8a?w=500&q=80', // Athletic Shirt
    '/fallback/product-fallback.avif', // Sports Shorts
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80', // Running Shoes
    '/fallback/product-fallback.avif', // Track Pants
    'https://images.unsplash.com/photo-1547638375-ebf04735d792?w=500&q=80', // Sports Jacket

    // Traditional Wear
    'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?w=500&q=80', // Thobe
    '/fallback/product-fallback.avif', // Bisht
    '/fallback/product-fallback.avif', // Shemagh
    'https://images.unsplash.com/photo-1591222566903-f9c4b9edf8ec?w=500&q=80', // Agal
    'https://images.unsplash.com/photo-1598449426314-8b02525e8733?w=500&q=80', // Embroidered Vest
  ],
  womenClothing: [
    // Dresses
    '/fallback/product-fallback.avif', // Elegant Dress
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&q=80', // Cocktail Dress
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', // Summer Dress
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80', // Evening Gown
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', // Maxi Dress

    // Tops & Blouses
    'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&q=80', // Blouse
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&q=80', // Silk Top
    'https://images.unsplash.com/photo-1559334417-a57bd929f003?w=500&q=80', // Casual Top
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500&q=80', // Printed Shirt
    'https://images.unsplash.com/photo-1533659828870-95ee305cee3e?w=500&q=80', // Cardigan

    // Bottoms
    'https://images.unsplash.com/photo-1587855049254-351f4e55fe02?w=500&q=80', // Skirt
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500&q=80', // Pants
    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&q=80', // Jeans
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80', // Shorts
    'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=500&q=80', // Leggings

    // Traditional & Modest Wear
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&q=80', // Hijab
    'https://images.unsplash.com/photo-1548624149-f9293404c2da?w=500&q=80', // Abaya
    'https://images.unsplash.com/photo-1578895101408-1a6a4f23795a?w=500&q=80', // Modest Dress
    'https://images.unsplash.com/photo-1605025207886-1d741d3a4f1d?w=500&q=80', // Kaftan
    'https://images.unsplash.com/photo-1577535967695-2c48bb5afae5?w=500&q=80', // Embroidered Shawl
  ],
  accessories: [
    // Bags
    'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=500&q=80', // Handbag
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80', // Tote Bag
    'https://images.unsplash.com/photo-1575891467811-070df21bd04a?w=500&q=80', // Backpack
    'https://images.unsplash.com/photo-1601369581450-d8a57076f2cb?w=500&q=80', // Clutch
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80', // Crossbody Bag

    // Jewelry
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80', // Necklace
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80', // Earrings
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80', // Bracelet
    'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80', // Ring
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80', // Gold Jewelry

    // Watches & Eyewear
    '/fallback/product-fallback.avif', // Watch
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&q=80', // Sunglasses
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', // Glasses
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500&q=80', // Luxury Watch
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', // Designer Sunglasses

    // Other Accessories
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80', // Scarf
    'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500&q=80', // Belt
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', // Hat
    'https://images.unsplash.com/photo-1613525850352-1e6f3fdf4b59?w=500&q=80', // Wallet
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80', // Hair Accessories
  ],
  footwear: [
    // Men's Footwear
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', // Formal Shoes
    'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&q=80', // Sneakers
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80', // Boots
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80', // Athletic Shoes
    'https://images.unsplash.com/photo-1564482565306-7b5aa35d2d9d?w=500&q=80', // Sandals

    // Women's Footwear
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80', // Heels
    '/fallback/product-fallback.avif', // Flats
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80', // Boots
    'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=500&q=80', // Sandals
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80', // Sneakers
  ],
};

// Fashion categories with Arabic translations
type CategoryType = 'menClothing' | 'womenClothing' | 'accessories' | 'footwear';

interface CategoryInfo {
  name: string;
  nameEn: string;
  type: CategoryType;
  slug: string;
  description: string;
  descriptionEn: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Expanded category information with SEO metadata
const categoriesData: CategoryInfo[] = [
  {
    name: 'ملابس رجالية',
    nameEn: "Men's Clothing",
    type: 'menClothing',
    slug: 'mens-clothing',
    description: 'تشكيلة واسعة من الملابس الرجالية العصرية بأفضل الماركات والجودة العالية',
    descriptionEn: 'A wide collection of modern men\'s clothing with the best brands and high quality',
    metaTitle: 'ملابس رجالية فاخرة | تسوق أحدث التشكيلات',
    metaDescription: 'تسوق أحدث تشكيلات الملابس الرجالية العصرية من أفضل الماركات العالمية. شحن سريع وضمان الجودة.'
  },
  {
    name: 'ملابس نسائية',
    nameEn: "Women's Clothing",
    type: 'womenClothing',
    slug: 'womens-clothing',
    description: 'تشكيلة متنوعة من الملابس النسائية بأحدث الصيحات والتصاميم العالمية',
    descriptionEn: 'A diverse collection of women\'s clothing with the latest trends and international designs',
    metaTitle: 'ملابس نسائية | أزياء عصرية بأفضل الأسعار',
    metaDescription: 'اكتشفي أجمل تشكيلات الملابس النسائية العصرية من أرقى الماركات. توصيل سريع وخدمة مميزة.'
  },
  {
    name: 'إكسسوارات',
    nameEn: 'Accessories',
    type: 'accessories',
    slug: 'accessories',
    description: 'إكسسوارات مميزة تكمل إطلالتك بتصاميم أنيقة وخامات فاخرة',
    descriptionEn: 'Distinctive accessories to complete your look with elegant designs and luxurious materials',
    metaTitle: 'إكسسوارات فاخرة | مجوهرات وحقائب وأكثر',
    metaDescription: 'اختر من تشكيلة واسعة من الإكسسوارات الأنيقة. حقائب، مجوهرات، أحزمة وأكثر بتصاميم عصرية.'
  },
  {
    name: 'أحذية',
    nameEn: 'Footwear',
    type: 'footwear',
    slug: 'footwear',
    description: 'أحذية مريحة وأنيقة للرجال والنساء من أشهر الماركات العالمية',
    descriptionEn: 'Comfortable and elegant footwear for men and women from the most famous international brands',
    metaTitle: 'أحذية رجالية ونسائية | تشكيلة واسعة من الموديلات',
    metaDescription: 'تسوق أحدث موديلات الأحذية الرجالية والنسائية من علامات تجارية عالمية. راحة واناقة في كل خطوة.'
  },
];

// Brand names (mix of international and local)
const fashionBrands = [
  // International Luxury Brands
  'جوتشي', // Gucci
  'لويس فيتون', // Louis Vuitton
  'برادا', // Prada
  'شانيل', // Chanel
  'ديور', // Dior
  'فيرساتشي', // Versace
  'بربري', // Burberry
  'فندي', // Fendi

  // International Casual Brands
  'زارا', // Zara
  'H&M',
  'نايك', // Nike
  'أديداس', // Adidas
  'بوما', // Puma
  'ريبوك', // Reebok
  'مانجو', // Mango
  'جاب', // Gap

  // Local/Regional Brands
  'نسك', // Nask
  'فتيحي', // Fatihi
  'الصايغ', // Al Sayegh
  'بيت الكندورة', // Bait Al Kandora
  'حجاب ستايل', // Hijab Style
  'عبايتي', // Abayati
  'الجابر', // Al Jaber
  'الشماغ الملكي', // Royal Shemagh
];

// Get random image based on category type
const getFashionImage = (type: CategoryType): string => {
  return faker.helpers.arrayElement(fashionImages[type]);
};

// Generate realistic price ranges based on category and quality
const generatePrice = (category: string, isLuxury: boolean): number => {
  const luxuryMultiplier = isLuxury ? 2.5 : 1;

  switch (category) {
    case 'accessories':
      return faker.number.int({ min: 50, max: 800 }) * luxuryMultiplier;
    case 'menClothing':
      return faker.number.int({ min: 100, max: 1200 }) * luxuryMultiplier;
    case 'womenClothing':
      return faker.number.int({ min: 150, max: 1500 }) * luxuryMultiplier;
    case 'footwear':
      return faker.number.int({ min: 200, max: 1000 }) * luxuryMultiplier;
    default:
      return faker.number.int({ min: 80, max: 500 }) * luxuryMultiplier;
  }
};

// Generate realistic product sizes based on category
const generateSizes = (category: CategoryType): string => {
  switch (category) {
    case 'menClothing':
    case 'womenClothing':
      return faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    case 'footwear':
      return faker.helpers.arrayElement([
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
      ]);
    case 'accessories':
      return faker.helpers.arrayElement(['One Size', 'S', 'M', 'L']);
    default:
      return 'One Size';
  }
};

// Generate detailed product description and specifications based on language
const generateProductDetails = (
  category: CategoryType,
  brand: string,
  isLuxury: boolean,
  languageCode: string,
): {
  details: string;
  material: string;
  color: string;
  features: string[];
  careInstructions: string;
} => {
  // Temporarily set locale for generating language-specific text
  // faker.locale = languageCode === 'ar-SA' ? 'ar' : 'en';

  const quality = isLuxury
    ? faker.helpers.arrayElement(['Premium', 'Luxury', 'High-end', 'Designer', 'Exclusive'])
    : faker.helpers.arrayElement(['Quality', 'Standard', 'Classic', 'Everyday', 'Casual']);

  const material =
    category === 'footwear'
      ? languageCode === 'ar-SA'
        ? faker.helpers.arrayElement(['جلد', 'جلد صناعي', 'قماش', 'مطاط', 'نسيج'])
        : faker.helpers.arrayElement(['Leather', 'Suede', 'Canvas', 'Synthetic', 'Textile'])
      : languageCode === 'ar-SA'
        ? faker.helpers.arrayElement(['قطن', 'حرير', 'كتان', 'بوليستر', 'صوف', 'كشمير', 'جينز'])
        : faker.helpers.arrayElement([
          'Cotton',
          'Silk',
          'Linen',
          'Polyester',
          'Wool',
          'Cashmere',
          'Denim',
        ]);

  const color = languageCode === 'ar-SA'
    ? faker.helpers.arrayElement([
      'أسود', 'أبيض', 'أزرق', 'أحمر', 'أخضر', 'رمادي', 'بني', 'وردي', 'بنفسجي', 'أصفر'
    ])
    : faker.helpers.arrayElement([
      'Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Pink', 'Purple', 'Yellow'
    ]);

  // Use the updated generateProductFeatures function
  const generatedFeatures = generateProductFeatures(category, languageCode);

  const careInstructions = languageCode === 'ar-SA'
    ? faker.helpers.arrayElement([
      'غسيل يدوي فقط',
      'غسيل آلي بماء بارد',
      'تنظيف جاف فقط',
      'مسح بقطعة قماش مبللة',
      'غسيل عادي',
    ])
    : faker.helpers.arrayElement([
      'Machine washable',
      'Hand wash only',
      'Dry clean only',
      'Wipe with damp cloth',
      'Normal wash',
    ]);

  const description = languageCode === 'ar-SA'
    ? `${quality} ${material} ${category === 'footwear' ? 'أحذية' : 'ملابس'} من ${brand}.
الميزات: ${generatedFeatures.join(', ')}.
${faker.commerce.productDescription()}
تعليمات العناية: ${careInstructions}.`
    : `${quality} ${material} ${category === 'footwear' ? 'footwear' : 'garment'} by ${brand}.
Features: ${generatedFeatures.join(', ')}.
${faker.commerce.productDescription()}
Care instructions: ${careInstructions}.`;

  // Reset locale to default (ar-SA as per import)
  // faker.locale = 'ar-SA';

  return {
    details: description,
    material: material,
    color: color,
    features: generatedFeatures,
    careInstructions: careInstructions,
  };
};

// Generate product features as array
const generateProductFeatures = (category: CategoryType, languageCode: string): string[] => {
  const features = [];
  const featureCount = faker.number.int({ min: 3, max: 6 });

  let featureList: string[];

  if (languageCode === 'ar-SA') {
    // Common features based on category in Arabic
    if (category === 'footwear') {
      featureList = [
        'مريح',
        'رياضي',
        'عام',
        'خفيف الوزن',
        'مقاوم للماء',
        'مقاوم للانزلاق',
        'نعل مطاطي',
        'بطانة ناعمة',
        'تصميم عصري',
        'مناسب للمشي اليومي',
      ];
    } else if (category === 'menClothing' || category === 'womenClothing') {
      featureList = [
        'قطن ناعم',
        'قماش مريح',
        'تصميم أنيق',
        'خامة ممتازة',
        'مناسب للمناسبات',
        'سهل الغسيل',
        'مقاوم للتجاعيد',
        'ألوان ثابتة',
        'تصميم عصري',
        'قصة مميزة',
      ];
    } else {
      // Accessories
      featureList = [
        'تصميم فريد',
        'جودة عالية',
        'مناسب للهدايا',
        'سهل الاستخدام',
        'متعدد الاستخدامات',
        'خامات فاخرة',
        'حجم مناسب',
        'خفيف الوزن',
        'متين',
        'عملي',
      ];
    }
  } else { // English
    // Common features based on category in English
    if (category === 'footwear') {
      featureList = [
        'Comfortable',
        'Athletic',
        'Casual',
        'Lightweight',
        'Waterproof',
        'Non-slip sole',
        'Rubber sole',
        'Soft lining',
        'Modern design',
        'Suitable for daily walking',
      ];
    } else if (category === 'menClothing' || category === 'womenClothing') {
      featureList = [
        'Soft cotton',
        'Comfortable fabric',
        'Elegant design',
        'Excellent material',
        'Suitable for occasions',
        'Easy to wash',
        'Wrinkle-resistant',
        'Colorfast',
        'Modern design',
        'Unique cut',
      ];
    } else {
      // Accessories
      featureList = [
        'Unique design',
        'High quality',
        'Suitable for gifts',
        'Easy to use',
        'Versatile',
        'Luxurious materials',
        'Suitable size',
        'Lightweight',
        'Durable',
        'Practical',
      ];
    }
  }

  for (let i = 0; i < featureCount; i++) {
    features.push(faker.helpers.arrayElement(featureList));
  }

  // Remove duplicates
  return [...new Set(features)];
};

// Generate SEO fields for products
const generateSEOFields = (name: string, category: CategoryType, brand: string, languageCode: string): {
  metaTitle: string,
  metaDescription: string,
  tags: string[]
} => {
  const categoryInfo = categoriesData.find(cat => cat.type === category);
  const categoryName = languageCode === 'ar-SA' ? categoryInfo?.name || 'منتج' : categoryInfo?.nameEn || 'Product';

  // Generate language-specific tags
  let tags: string[];
  if (languageCode === 'ar-SA') {
    tags = [
      brand, // Keep brand as is, it can be Arabic or English
      categoryName,
      faker.helpers.arrayElement(['عصري', 'أنيق', 'فاخر', 'حديث', 'كلاسيكي']),
      faker.helpers.arrayElement(['وصول جديد', 'الأكثر مبيعاً', 'إصدار محدود', 'تخفيضات', 'مميز']),
    ];
  } else { // English
    tags = [
      brand, // Keep brand as is
      categoryName,
      faker.helpers.arrayElement(['Trendy', 'Stylish', 'Elegant', 'Modern', 'Classic']),
      faker.helpers.arrayElement(['New Arrival', 'Best Seller', 'Limited Edition', 'Sale', 'Featured']),
    ];
  }


  // Generate language-specific meta title and description
  let metaTitle: string;
  let metaDescription: string;

  if (languageCode === 'ar-SA') {
    metaTitle = `${name} | ${brand} - ${categoryName} فاخر`;
    metaDescription = `تسوق ${name} من ${brand}. ${categoryName} عالي الجودة بتصميم فريد وخامات ممتازة. شحن سريع وإرجاع سهل.`;
  } else { // English
    metaTitle = `${name} | ${brand} - Premium ${categoryName}`;
    metaDescription = `Shop ${name} from ${brand}. High-quality ${categoryName.toLowerCase()} with unique design and premium materials. Fast shipping and easy returns.`;
  }


  return {
    metaTitle: metaTitle,
    metaDescription: metaDescription,
    tags: tags
  };
};

// Utility logging function with timestamps
const log = (message: string): void => {
  console.warn(`[${new Date().toISOString()}] ${message}`);
};

// Helper: Parse command-line arguments with default values
function getArgValue(argName: string, defaultValue: number): number {
  const arg = process.argv.find((arg) => arg.startsWith(`--${argName}=`));
  if (arg) {
    const value = parseInt(arg.split('=')[1], 10);
    if (!isNaN(value) && value > 0) {
      return value;
    }
  }
  return defaultValue;
}

// Create product categories with translations
async function createProductCategories() {
  log('Creating product categories with translations...');

  const createdCategories = [];

  for (const category of categoriesData) {
    // Check if category already exists
    const existingCategory = await db.category.findUnique({
      where: { slug: category.slug }
    });

    if (existingCategory) {
      log(`Category ${category.nameEn} already exists, skipping creation`);
      createdCategories.push(existingCategory);
      continue;
    }

    // Create category with translations
    const createdCategory = await db.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: faker.helpers.arrayElement(fashionImages[category.type]),
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        translations: {
          create: [
            {
              languageCode: 'ar-SA',
              name: category.name,
              description: category.description,
              metaTitle: category.metaTitle,
              metaDescription: category.metaDescription
            },
            {
              languageCode: 'en',
              name: category.nameEn,
              description: category.descriptionEn,
              metaTitle: `${category.nameEn} | Shop Premium Products`,
              metaDescription: `Explore our collection of ${category.nameEn.toLowerCase()}. High-quality products with fast shipping and easy returns.`
            }
          ]
        }
      },
      include: {
        translations: true
      }
    });

    createdCategories.push(createdCategory);
    log(`Created category: ${createdCategory.name} with translations`);
  }

  log(`Successfully created ${createdCategories.length} categories with translations`);
  return createdCategories;
}

// Generate fashion products with multiple suppliers
async function generateFashionProducts(count: number, supplierId: string) {
  log(`Generating ${count} fashion products...`);

  // Get all suppliers if we want to distribute products among them
  const suppliers = await db.supplier.findMany();

  // Get all categories to assign products to them
  const categories = await db.category.findMany();

  if (categories.length === 0) {
    log('No categories found. Creating categories first...');
    await createProductCategories();
    // Re-fetch categories
    const newCategories = await db.category.findMany();
    if (newCategories.length === 0) {
      throw new Error('Failed to create categories');
    }
  }

  const products = [];
  for (let i = 0; i < count; i++) {
    const categoryInfo = faker.helpers.arrayElement(categoriesData);
    const category = await db.category.findFirst({
      where: { slug: categoryInfo.slug }
    });

    if (!category) {
      log(`Category ${categoryInfo.nameEn} not found, skipping product`);
      continue;
    }

    const brand = faker.helpers.arrayElement(fashionBrands);
    const isLuxury = fashionBrands.indexOf(brand) < 8; // First 8 brands are luxury
    const price = generatePrice(categoryInfo.type, isLuxury);
    const compareAtPrice = isLuxury ? price * 1.2 : null; // 20% higher original price for luxury items on sale
    const costPrice = price * 0.6; // 60% of retail price as cost

    // Create product name with brand and category
    // Generate English name components
    const adjectiveEn = faker.commerce.productAdjective(); // English adjective (default locale)
    const nameEn = `${brand} ${adjectiveEn} ${categoryInfo.nameEn}`; // English base name

    // Switch locale temporarily for Arabic adjective
    // faker.locale = 'ar';
    const adjectiveAr = faker.commerce.productAdjective(); // Arabic adjective
    // faker.locale = 'ar-SA'; // Switch back to ar-SA locale

    const nameAr = `${brand} ${adjectiveAr} ${categoryInfo.name}`; // Arabic name

    // Randomly assign to a supplier (or use the provided supplierId)
    const productSupplierId =
      suppliers.length > 1 ? faker.helpers.arrayElement(suppliers).id : supplierId;

    // Add initial rating and review count for some products
    const hasInitialRating = faker.datatype.boolean(0.7); // 70% of products have initial ratings
    const initialRating = hasInitialRating
      ? faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 })
      : null;
    const initialReviewCount = hasInitialRating ? faker.number.int({ min: 1, max: 10 }) : 0;

    // Generate a unique slug using the Slugify function
    const baseSlug = Slugify(nameAr);

    // Add a short random string to ensure uniqueness
    const uniqueSlug = `${baseSlug}-${faker.string.alphanumeric(4).toLowerCase()}`;

    // Generate 2-5 additional images for the product
    const additionalImagesCount = faker.number.int({ min: 2, max: 5 });
    const mainImage = getFashionImage(categoryInfo.type);
    const additionalImages = [mainImage]; // Include main image in the array

    // Add additional images from the same category
    for (let j = 0; j < additionalImagesCount; j++) {
      const additionalImage = getFashionImage(categoryInfo.type);
      // Avoid duplicate images
      if (!additionalImages.includes(additionalImage)) {
        additionalImages.push(additionalImage);
      }
    }

    // Generate product code (SKU)
    const productCode = faker.string.alphanumeric(8).toUpperCase();

    // Generate dimensions for the product
    const dimensions = faker.helpers.arrayElement([
      '30x20x10 سم', '25x15x5 سم', '40x30x15 سم', '20x15x8 سم', '35x25x12 سم'
    ]);

    // Generate weight
    const weight = faker.helpers.arrayElement([
      '0.5 كغ', '0.8 كغ', '1.2 كغ', '0.3 كغ', '1.5 كغ', '2.0 كغ'
    ]);

    // Generate stock quantity
    const manageInventory = faker.datatype.boolean(0.7); // 70% of products have inventory tracking
    const stockQuantity = manageInventory ? faker.number.int({ min: 0, max: 100 }) : null;
    const outOfStock = manageInventory && stockQuantity !== null ? stockQuantity === 0 : faker.datatype.boolean(0.15);

    // Calculate shipping days based on stock
    const shippingDays = outOfStock ? '7-14' : '3-5';

    // Create the product with translations
    // Generate English details and SEO fields
    const detailsEn = generateProductDetails(categoryInfo.type, brand, isLuxury, 'en');
    const seoFieldsEn = generateSEOFields(nameEn, categoryInfo.type, brand, 'en');

    // Generate Arabic details and SEO fields
    const detailsAr = generateProductDetails(categoryInfo.type, brand, isLuxury, 'ar-SA');
    const seoFieldsAr = generateSEOFields(nameAr, categoryInfo.type, brand, 'ar-SA');

    try {
      const createdProduct = await db.product.create({
        data: {
          name: nameEn, // Base name is English
          slug: uniqueSlug,
          price: price,
          compareAtPrice: compareAtPrice,
          costPrice: costPrice,
          size: generateSizes(categoryInfo.type), // Sizes are generic
          details: detailsEn.details, // Use English details from the generated object
          imageUrl: mainImage,
          images: additionalImages,
          supplierId: productSupplierId,
          type: categoryInfo.type,
          published: faker.datatype.boolean(0.9), // 90% chance to be published
          outOfStock: outOfStock,
          rating: initialRating,
          reviewCount: initialReviewCount,

          // Product specifications
          productCode: productCode,
          gtin: faker.string.numeric(13), // 13-digit EAN/barcode
          material: detailsEn.material, // Use English material from the generated object
          brand: brand, // Brand is from the list, can be Arabic or English
          color: detailsEn.color, // Use English color from the generated object
          dimensions: dimensions, // Dimensions are generic
          weight: weight, // Weight is generic
          features: detailsEn.features, // Use English features from the generated object

          // Shipping and return info
          requiresShipping: true,
          shippingDays: shippingDays,
          returnPeriodDays: 14,
          hasQualityGuarantee: true,
          careInstructions: detailsEn.careInstructions, // Use English care instructions from the generated object

          // Inventory management
          manageInventory: manageInventory,
          stockQuantity: stockQuantity,

          // SEO and organization (Base SEO fields are English)
          metaTitle: seoFieldsEn.metaTitle,
          metaDescription: seoFieldsEn.metaDescription,
          tags: seoFieldsEn.tags, // Base tags are English

          // Create translations inline
          translations: {
            create: [
              {
                languageCode: 'ar-SA',
                name: nameAr, // Use the generated Arabic name
                details: detailsAr.details, // Use Arabic details
                metaTitle: seoFieldsAr.metaTitle, // Use Arabic meta title
                metaDescription: seoFieldsAr.metaDescription // Use Arabic meta description
              },
              {
                languageCode: 'en',
                name: nameEn, // Use the generated English name
                details: detailsEn.details, // Use English details
                metaTitle: seoFieldsEn.metaTitle, // Use English meta title
                metaDescription: seoFieldsEn.metaDescription // Use English meta description
              }
            ]
          },

          // Create category assignment
          categoryAssignments: {
            create: {
              categoryId: category.id
            }
          }
        }
      });

      products.push(createdProduct);

      if ((i + 1) % 10 === 0) {
        log(`Generated ${i + 1} products`);
      }
    } catch (error) {
      log(`Error creating product ${i + 1}: ${error}`);
      continue;
    }
  }

  log(`Successfully created ${products.length} fashion products`);
  return products;
}

// Helper to get a random date in the last N months
function getRandomDateInLastMonths(months: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Helper to get a random date in the current month
function getRandomDateInCurrentMonth(): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Helper to get a random date today
function getRandomDateToday(): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// Example usage in your product/order generation logic:
// When creating an order or product, assign createdAt as follows:
// - 60% of data: last 6 months
// - 30% of data: current month
// - 10% of data: today

function getWeightedRandomDate() {
  const r = Math.random();
  if (r < 0.1) return getRandomDateToday();
  if (r < 0.4) return getRandomDateInCurrentMonth();
  return getRandomDateInLastMonths(6);
}

// Generate orders with realistic fashion shopping patterns
async function generateFashionOrders(count: number, shiftId: string) {
  log(`Generating ${count} fashion orders...`);

  const users = await db.user.findMany();
  const products = await db.product.findMany();
  const drivers = await db.driver.findMany();

  if (!users.length || !products.length) {
    throw new Error('No users or products found. Please seed users and products first.');
  }

  // Group products by category to create realistic shopping patterns
  const productsByCategory = products.reduce(
    (acc, product) => {
      const category = product.type || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  const orders = [];
  for (let i = 0; i < count; i++) {
    // Generate order date within the year 2024 for better reporting analysis
    const orderDate = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T23:59:59.999Z' });

    // Determine shopping pattern (e.g., single category or mixed)
    const isSingleCategoryOrder = faker.datatype.boolean(0.7); // 70% chance of buying from same category

    let selectedProducts: Product[] = [];
    if (isSingleCategoryOrder) {
      // Select a random category and pick items from it
      const category = faker.helpers.arrayElement(Object.keys(productsByCategory));
      const categoryProducts = productsByCategory[category];
      if (categoryProducts && categoryProducts.length) {
        const itemCount = faker.number.int({ min: 1, max: 4 });
        selectedProducts = faker.helpers.arrayElements(
          categoryProducts,
          Math.min(itemCount, categoryProducts.length),
        );
      }
    } else {
      // Mixed category order - pick random products
      const itemCount = faker.number.int({ min: 2, max: 6 });
      selectedProducts = faker.helpers.arrayElements(products, itemCount);
    }

    // If no products were selected (unlikely), skip this iteration
    if (selectedProducts.length === 0) {
      log(`Warning: No products selected for order ${i + 1}. Skipping.`);
      continue;
    }

    // Create order items with realistic quantities
    const items = selectedProducts.map((product) => {
      // People often buy multiple of the same item in fashion (different sizes, colors, etc.)
      const isMultipleQuantity = faker.datatype.boolean(0.3); // 30% chance of buying multiple
      const quantity = isMultipleQuantity ? faker.number.int({ min: 2, max: 4 }) : 1;

      return {
        productId: product.id,
        quantity: quantity,
        price: product.price,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const orderNumber = await generateOrderNumber();
      const user = faker.helpers.arrayElement(users);

      // Assign a driver randomly (if available)
      const driverId = drivers.length > 0 ? faker.helpers.arrayElement(drivers).id : undefined;

      // Create more realistic order status distribution
      const orderStatus = faker.helpers.weightedArrayElement([
        { weight: 0.2, value: ORDER_STATUS.PENDING },
        { weight: 0.15, value: ORDER_STATUS.IN_TRANSIT },
        { weight: 0.5, value: ORDER_STATUS.DELIVERED },
        { weight: 0.15, value: ORDER_STATUS.CANCELED },
      ]);

      const createdOrder = await db.order.create({
        data: {
          orderNumber,
          customerId: user.id,
          customerName: user.name || undefined,
          driverId: driverId,
          status: orderStatus,
          amount: totalAmount,
          items: {
            create: items,
          },
          latitude: faker.location.latitude().toString(),
          longitude: faker.location.longitude().toString(),
          isTripStart: orderStatus === ORDER_STATUS.IN_TRANSIT,
          resonOfcancel:
            orderStatus === 'CANCELED'
              ? faker.helpers.arrayElement([
                'Customer requested cancellation',
                'Items out of stock',
                'Delivery address issue',
                'Payment problem',
                'Order placed by mistake',
              ])
              : undefined,
          shiftId: shiftId,
          createdAt: getWeightedRandomDate(),
          updatedAt: faker.date.between({ from: orderDate, to: new Date() }),
          deliveredAt: orderStatus === ORDER_STATUS.DELIVERED ? faker.date.between({ from: orderDate, to: new Date() }) : undefined,
        },
      });

      orders.push(createdOrder);

      // If order is "InWay", create an OrderInWay record
      if (orderStatus === ORDER_STATUS.IN_TRANSIT && driverId) {
        // Check if the driver already has an 'InWay' order
        const existingOrderInWay = await db.orderInWay.findUnique({
          where: { driverId: driverId },
        });

        // Only create OrderInWay if the driver is not already assigned to one
        if (!existingOrderInWay) {
          await db.orderInWay.create({
            data: {
              orderId: createdOrder.id,
              driverId: driverId,
              orderNumber: orderNumber,
              latitude: faker.location.latitude(),
              longitude: faker.location.longitude(),
            },
          });
        } else {
          log(`Driver ${driverId} already has an 'IN_WAY' order. Skipping OrderInWay creation for order ${orderNumber}.`);
        }
      }

      if ((i + 1) % 10 === 0) {
        log(`Generated ${i + 1} orders`);
      }
    } catch (error) {
      log(`Error creating order ${i + 1}: ${error}`);
      continue;
    }
  }

  log(`Successfully generated ${orders.length} fashion orders`);
  return orders;
}

// Create shifts for orders
async function createShifts() {
  log('Creating shifts...');
  try {
    const shifts = await db.shift.findMany();

    if (shifts.length > 0) {
      log(`Using existing shifts (${shifts.length} found)`);
      return shifts[0];
    }

    const morningShift = await db.shift.create({
      data: {
        name: 'صباح',
        startTime: '09:00',
        endTime: '17:00',
      },
    });

    await db.shift.create({
      data: {
        name: 'مساء',
        startTime: '17:00',
        endTime: '01:00',
      },
    });

    log(`Created shifts successfully`);
    return morningShift;
  } catch (error) {
    log(`Error creating shifts: ${error}`);
    throw error;
  }
}

// High-quality slider/banner images for the e-commerce homepage
const sliderImages = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', // Fashion banner with models
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', // Shopping mall with fashion stores
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80', // Fashion model in urban setting
  'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&q=80', // Luxury fashion items
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80', // Fashion accessories display
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80', // Clothing rack with colorful items
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1200&q=80', // Seasonal fashion sale
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80', // Luxury shopping bags
];

// Generate slider images for the homepage
async function generateSliderImages() {
  log(`Generating slider images for the homepage...`);

  try {
    const promotions = [];

    // Use index to create unique coupon codes
    for (let i = 0; i < sliderImages.length; i++) {
      const imageUrl = sliderImages[i];
      const title = faker.commerce.productAdjective() + ' ' + faker.commerce.department() + ' Collection';

      // Generate a unique coupon code
      const couponCode = `FASHION${i}${faker.string.alphanumeric(6).toUpperCase()}`;

      // Generate slug from title
      let slug = Slugify(title);

      // Add a unique identifier to ensure uniqueness
      slug = `${slug}-${faker.string.alphanumeric(6).toLowerCase()}`;

      promotions.push({
        title: title,
        description: faker.commerce.productDescription(),
        imageUrl: imageUrl,
        type: PromotionType.PERCENTAGE_PRODUCT, // Use proper enum value
        discountValue: faker.number.int({ min: 10, max: 50 }), // Discount percentage between 10-50%
        discountType: DiscountType.PERCENTAGE, // Use proper enum value
        active: true,
        couponCode: couponCode, // Add the unique coupon code
        slug: slug, // Add the slug field
        startDate: faker.date.past({ years: 0.1 }), // About a month ago
        endDate: faker.date.future({ years: 0.25 }), // About 3 months in future
        translations: {
          create: [
            {
              languageCode: 'ar-SA',
              title: title + ' (عربي)',
              description: faker.commerce.productDescription() + ' (عربي)'
            },
            {
              languageCode: 'en',
              title: title,
              description: faker.commerce.productDescription()
            }
          ]
        }
      });
    }

    for (const promotion of promotions) {
      await db.promotion.create({
        data: {
          title: promotion.title,
          description: promotion.description,
          imageUrl: promotion.imageUrl,
          type: promotion.type,
          discountValue: promotion.discountValue,
          discountType: promotion.discountType,
          couponCode: promotion.couponCode, // Include the coupon code
          slug: promotion.slug, // Include the slug
          active: promotion.active,
          startDate: promotion.startDate,
          endDate: promotion.endDate,
          translations: promotion.translations
        }
      });
    }

    log(`Successfully created ${promotions.length} slider images with translations`);
  } catch (error) {
    log(`Error creating slider images: ${error}`);
    throw error;
  }
}

// Generate product reviews with realistic distribution
async function generateProductReviews() {
  log('Generating product reviews...');

  try {
    // Get all products and users
    const products = await db.product.findMany({
      where: { reviewCount: { gt: 0 } }, // Only products with reviewCount > 0
    });
    const users = await db.user.findMany();

    if (!users.length) {
      log('No users found. Skipping review generation.');
      return;
    }

    let totalReviews = 0;
    const reviews = [];

    // For each product with reviewCount > 0, generate that many reviews (max 10)
    for (const product of products) {
      if (!product.reviewCount) continue;

      // Get all orders containing this product to mark reviews as verified
      const orderItems = await db.orderItem.findMany({
        where: { productId: product.id },
        include: { order: { include: { customer: true } } },
      });

      // Create a set of user IDs who have purchased this product
      const purchaserIds = new Set(
        orderItems
          .filter((item) => item.order?.status === 'Delivered')
          .map((item) => item.order?.customerId)
          .filter(Boolean),
      );

      // Limit reviews to a maximum of 10 per product
      const maxReviews = Math.min(product.reviewCount, 5);

      // Generate reviews up to the maxReviews
      for (let i = 0; i < maxReviews; i++) {
        // Try to use purchasers first, then fall back to random users
        let userId: string;
        let isVerified = false;

        if (purchaserIds.size > 0 && i < purchaserIds.size) {
          // Use a purchaser (verified review)
          const purchaserId = Array.from(purchaserIds)[i];
          if (purchaserId) {
            userId = purchaserId;
            isVerified = true;
          } else {
            // Fallback to random user if purchaserId is undefined
            userId = faker.helpers.arrayElement(users).id;
          }
        } else {
          // Use a random user (unverified review)
          userId = faker.helpers.arrayElement(users).id;
        }

        // Generate a rating that's close to the product's average rating
        const baseRating = product.rating || 4;
        const variation = faker.number.int({ min: -1, max: 1 });
        const rating = Math.max(1, Math.min(5, Math.round(baseRating + variation)));

        // Generate review text based on rating
        let comment;
        if (rating >= 4) {
          comment = faker.helpers.arrayElement([
            `منتج رائع! ${faker.commerce.productAdjective()} جداً.`,
            `أنا سعيد جداً بهذا المنتج. الجودة ممتازة.`,
            `تجربة شراء ممتازة. سأشتري مرة أخرى.`,
            `يستحق كل ريال. ${faker.commerce.productAdjective()} وعملي.`,
            `أفضل ${product.type} اشتريته. أوصي به بشدة.`,
          ]);
        } else if (rating === 3) {
          comment = faker.helpers.arrayElement([
            `منتج جيد ولكن ليس رائعاً. ${faker.commerce.productAdjective()} ولكن هناك بعض العيوب.`,
            `جودة معقولة مقابل السعر.`,
            `منتج متوسط. يمكن أن يكون أفضل.`,
            `يلبي الغرض ولكن لا يتجاوز التوقعات.`,
            `تجربة مقبولة ولكن هناك مجال للتحسين.`,
          ]);
        } else {
          comment = faker.helpers.arrayElement([
            `لست راضياً عن هذا المنتج. ${faker.commerce.productAdjective()} ولكن الجودة سيئة.`,
            `لا أوصي بهذا المنتج. خيبة أمل كبيرة.`,
            `سعر مرتفع مقابل جودة منخفضة.`,
            `لن أشتري مرة أخرى. تجربة سيئة.`,
            `المنتج لا يطابق الوصف. غير راضٍ.`,
          ]);
        }

        // Create the review object
        const createdReview = await db.review.create({
          data: {
            productId: product.id,
            userId: userId,
            rating: rating,
            comment: comment,
            isVerified: isVerified,
            createdAt: faker.date.between({ from: product.createdAt, to: new Date() }), // Review date after product creation
          },
        });

        reviews.push(createdReview);
        totalReviews++;

        if (totalReviews % 50 === 0) {
          log(`Created ${totalReviews} reviews so far`);
        }
      }
    }

    log(`✅ All product review data generation is complete. Total reviews created: ${totalReviews}`);
    return reviews;
  } catch (error) {
    log(`Error generating product reviews: ${error}`);
    throw error;
  }
}

// Generate wishlist items for users
async function generateWishlistItems() {
  log('Generating wishlist items...');

  try {
    const users = await db.user.findMany();
    const products = await db.product.findMany({
      where: { published: true },
    });

    if (!users.length || !products.length) {
      log('No users or products found. Skipping wishlist generation.');
      return;
    }

    const wishlistItems = [];
    let totalItems = 0;

    // For each user, add some products to their wishlist
    for (const user of users) {
      // Determine how many items to add to this user's wishlist (0-10)
      const itemCount = faker.number.int({ min: 0, max: 10 });

      if (itemCount === 0) continue;

      // Select random products for this user's wishlist
      const selectedProducts = faker.helpers.arrayElements(products, itemCount);

      for (const product of selectedProducts) {
        try {
          const createdItem = await db.wishlistItem.create({
            data: {
              userId: user.id,
              productId: product.id,
              createdAt: faker.date.past({ years: 1 }),
            }
          });

          wishlistItems.push(createdItem);
          totalItems++;

          if (totalItems % 50 === 0) {
            log(`Created ${totalItems} wishlist items so far`);
          }
        } catch (error) {
          // Skip duplicates (unique constraint violation)
          if (!(error instanceof Error) || !error.message.includes('Unique constraint')) {
            log(`Error creating wishlist item: ${error}`);
          }
        }
      }
    }

    log(`Successfully generated ${totalItems} wishlist items`);
    return wishlistItems;
  } catch (error) {
    log(`Error generating wishlist items: ${error}`);
    throw error;
  }
}

// Clean up existing data before seeding
async function cleanupExistingData(shouldCleanup: boolean) {
  if (!shouldCleanup) {
    log('Skipping data cleanup as requested');
    return;
  }

  log('Cleaning up existing data before seeding...');

  try {
    // Delete in the correct order to respect foreign key constraints
    log('Deleting existing reviews...');
    await db.review.deleteMany({});
    log('Finished deleting reviews.');

    // Check if any reviews remain (for debugging)
    const remainingReviews = await db.review.findMany({ select: { id: true } });
    if (remainingReviews.length > 0) {
      log(`ERROR: ${remainingReviews.length} reviews still exist after deleteMany.`);
      // Optionally throw an error or handle this unexpected state
      // throw new Error("Failed to delete all reviews.");
    } else {
      log('Successfully verified no reviews remain.');
    }

    log('Deleting existing wishlist items...');
    await db.wishlistItem.deleteMany({});

    log('Deleting existing category-product assignments...');
    await db.categoryProduct.deleteMany({});

    log('Deleting existing orders and order items...');
    await db.orderInWay.deleteMany({});
    await db.orderItem.deleteMany({});
    await db.order.deleteMany({});

    log('Deleting existing product translations...');
    await db.productTranslation.deleteMany({});

    // Attempt to delete reviews again right before deleting products (debugging step)
    log('Attempting to delete reviews again before deleting products...');
    await db.review.deleteMany({});
    log('Finished second attempt to delete reviews.');

    log('Deleting existing products...');
    await db.product.deleteMany({});

    log('Deleting existing category translations...');
    await db.categoryTranslation.deleteMany({});

    log('Deleting existing categories...');
    await db.category.deleteMany({});

    log('Deleting existing supplier translations...');
    await db.supplierTranslation.deleteMany({});

    log('Deleting existing suppliers...');
    await db.supplier.deleteMany({});

    log('Deleting existing promotion translations...');
    await db.promotionTranslation.deleteMany({});

    log('Deleting existing promotions...');
    await db.promotion.deleteMany({});

    log('Data cleanup completed successfully');
  } catch (error) {
    log(`Error during data cleanup: ${error}`);
    throw error;
  }
}

// Main seeding function
async function main() {
  // Parse command line arguments
  const productCount = getArgValue('products', 50);
  const orderCount = getArgValue('orders', 20);

  // Always clean up existing data first regardless of command line arguments
  const shouldCleanup = true;

  try {
    // Clean up existing data always
    log('🧹 Always cleaning up existing data first to avoid conflicts...');
    await cleanupExistingData(shouldCleanup);

    // Create or get existing shift
    const shift = (await db.shift.findFirst()) || (await createShifts());
    log(`Using shift: ${shift.name} (${shift.id})`);

    // Create categories
    log('Creating product categories...');
    await createProductCategories();

    // Create suppliers
    log('Creating suppliers...');
    const suppliers = await createFashionSuppliers();
    const mainSupplier = suppliers[0];

    // Generate products
    log(`Generating ${productCount} products...`);
    await generateFashionProducts(productCount, mainSupplier.id);

    // Generate slider images for the homepage
    log('Generating slider images...');
    await generateSliderImages();

    // Generate orders
    log(`Generating ${orderCount} orders...`);
    await generateFashionOrders(orderCount, shift.id);

    // Generate product reviews
    log('Generating product reviews...');
    await generateProductReviews();

    // Generate wishlist items
    log('Generating wishlist items...');
    await generateWishlistItems();

    log('Fashion seed data generation completed successfully with full data flow!');
    log('✅ Categories created with translations');
    log('✅ Suppliers created with translations');
    log('✅ Products created with translations and category assignments');
    log('✅ Slider images/promotions created with translations');
    log('✅ Orders created');
    log('✅ Product reviews created');
    log('✅ Wishlist items created');

    // --- POST-PROCESS: Ensure all isTripStart orders are in OrderInWay ---
    log('🔎 Post-processing: Ensuring all isTripStart orders are in OrderInWay...');
    const tripOrders = await db.order.findMany({ where: { isTripStart: true } });
    let addedCount = 0;
    for (const order of tripOrders) {
      if (!order.driverId) continue;
      const existing = await db.orderInWay.findUnique({ where: { driverId: order.driverId } });
      if (!existing) {
        await db.orderInWay.create({
          data: {
            orderId: order.id,
            driverId: order.driverId,
            orderNumber: order.orderNumber,
            latitude: order.latitude ? parseFloat(order.latitude) : 0,
            longitude: order.longitude ? parseFloat(order.longitude) : 0,
          },
        });
        addedCount++;
      }
    }
    log(`✅ Post-processing complete. Added ${addedCount} missing OrderInWay records.`);
  } catch (error) {
    log(`Seed data generation failed: ${error}`);
    process.exit(1);
  }
}

// Run the seeding
if (import.meta.url === new URL('file://' + process.argv[1]).href) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export {
  cleanupExistingData,
  createFashionSuppliers,
  createProductCategories,
  generateFashionOrders,
  generateFashionProducts,
  generateProductReviews,
  generateSliderImages,
  generateWishlistItems,
};
