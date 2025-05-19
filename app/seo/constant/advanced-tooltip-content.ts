// app/seo/constant/advanced-tooltip-content.ts
export const AdvancedSeoFormTooltips = {
  schemaOrg: "بيانات Schema.org (JSON-LD): تساعد محركات البحث على فهم محتوى صفحتك بشكل أفضل وعرضه بطرق محسنة (Rich Snippets). أدخل كائن JSON صالح. لمزيد من المعلومات، راجع <a href='https://schema.org/docs/gs.html' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:underline'>Schema.org</a> ولاختبار صحة البيانات: <a href='https://search.google.com/test/rich-results' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:underline'>Google Rich Results Test</a>.",
  industryData: "بيانات خاصة بالصناعة (JSON): حقول مخصصة بناءً على نوع الصناعة المحدد. أدخل كائن JSON صالح."
};

import type { EntityType, IndustryType } from '@prisma/client';

type Template = { label: string; value: string };

export const SchemaOrgTemplates: Record<EntityType | 'DEFAULT', Template[]> = {
  PAGE: [
    {
      label: "Basic WebPage",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "عنوان الصفحة هنا", // Arabic: Page Title Here
        "description": "وصف الصفحة هنا", // Arabic: Page Description Here
        "url": "https://example.com/your-page-url"
      }, null, 2)
    },
    {
      label: "WebPage with Publisher",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "عنوان الصفحة هنا",
        "description": "وصف الصفحة هنا",
        "url": "https://example.com/your-page-url",
        "publisher": {
          "@type": "Organization",
          "name": "اسم الناشر أو الشركة", // Publisher/Organization Name
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
          }
        }
      }, null, 2)
    }
  ],
  PRODUCT: [
    {
      label: "Basic Product",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "اسم المنتج", // Product Name
        "image": "https://example.com/product-image.jpg",
        "description": "وصف المنتج", // Product Description
        "sku": "YOUR-SKU",
        "brand": {
          "@type": "Brand",
          "name": "اسم العلامة التجارية" // Brand Name
        },
        "offers": {
          "@type": "Offer",
          "url": "https://example.com/product-url",
          "priceCurrency": "SAR",
          "price": "99.99",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      }, null, 2)
    },
  ],
  BLOG_POST: [
    {
      label: "Basic Article/Blog Post",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "عنوان المقال هنا", // Article Headline
        "image": "https://example.com/article-image.jpg",
        "author": {
          "@type": "Person",
          "name": "اسم المؤلف" // Author Name
        },
        "publisher": {
          "@type": "Organization",
          "name": "اسم الناشر", // Publisher Name
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
          }
        },
        "datePublished": "YYYY-MM-DD",
        "dateModified": "YYYY-MM-DD"
      }, null, 2)
    }
  ],
  CATEGORY: [
    {
      label: "Basic CollectionPage (Category)",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "اسم الفئة", // Category Name
        "description": "وصف الفئة", // Category Description
        "url": "https://example.com/category-url"
      }, null, 2)
    }
  ],
  OFFER: [
    {
      label: "Basic Offer",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "اسم المنتج المعروض" // Offered Product Name
        },
        "priceCurrency": "SAR",
        "price": "79.99",
        "availability": "https://schema.org/InStock",
        "url": "https://example.com/offer-url",
        "validFrom": "YYYY-MM-DD",
        "validThrough": "YYYY-MM-DD"
      }, null, 2)
    }
  ],
  BLOG_CATEGORY: [ // Added placeholder for BLOG_CATEGORY
    {
      label: "Basic Blog Category Page",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "اسم فئة المدونة", // Blog Category Name
        "description": "وصف فئة المدونة", // Blog Category Description
        "url": "https://example.com/blog-category-url"
      }, null, 2)
    }
  ],
  DEFAULT: [ // Fallback template
    {
      label: "Basic WebPage (Default)",
      value: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Default Page Title",
        "description": "Default page description.",
        "url": "https://example.com/default-page"
      }, null, 2)
    }
  ],
};

// Basic industry data templates (can be expanded)
export const IndustryDataTemplates: Partial<Record<IndustryType, Template[]>> = {
  CLOTHING: [
    {
      label: "Clothing Details",
      value: JSON.stringify({
        "size": "L",
        "color": "أحمر", // Red
        "material": "قطن", // Cotton
        "gender": "unisex", // or "male", "female"
        "ageGroup": "adult" // or "kids"
      }, null, 2)
    }
  ],
  ELECTRONICS: [
    {
      label: "Electronics Details",
      value: JSON.stringify({
        "modelNumber": "ELEC-XYZ-001",
        "manufacturer": "اسم المصنع", // Manufacturer Name
        "powerSource": "Battery",
        "voltage": "220V"
      }, null, 2)
    }
  ],
  FOOD: [
    {
      label: "Food Item Details",
      value: JSON.stringify({
        "cuisine": "مأكولات شرق أوسطية", // Middle Eastern Cuisine
        "dietaryRestrictions": ["حلال", "خالي من الغلوتين"], // Halal, Gluten-Free
        "calories": "350",
        "ingredients": ["مكون 1", "مكون 2"] // Ingredient 1, Ingredient 2
      }, null, 2)
    }
  ],
  WATER: [ // Example for WATER industry
    {
      label: "Water Product Details",
      value: JSON.stringify({
        "type": "مياه معدنية طبيعية", // Natural Mineral Water
        "source": "اسم المصدر", // Source Name
        "volume": "500ml",
        "packaging": "Plastic Bottle"
      }, null, 2)
    }
  ],
  // Add other industry types as needed
  AUTOMOTIVE: [],
  BEAUTY: [],
  BOOKS: [],
  HEALTH: [],
  HOME: [],
  JEWELRY: [],
  SPORTS: [],
  TOYS: [],
  TRAVEL: [],
  OTHER: [
    {
      label: "General Custom Data",
      value: JSON.stringify({
        "customField1": "قيمة مخصصة 1", // Custom Value 1
        "customField2": "قيمة مخصصة 2"  // Custom Value 2
      }, null, 2)
    }
  ]
};
