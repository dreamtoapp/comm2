# تقرير حول محدودية ذاكرة التخزين المؤقت لبيانات Next.js

## ملخص تنفيذي

يتناول هذا التقرير الخطأ الذي تمت مواجهته في تطبيق التجارة الإلكترونية الخاص بك:

```
Error: Failed to set Next.js data cache, items over 2MB can not be cached (4676126 bytes)
```

يحدث الخطأ لأن Next.js لديه حد حجم مدمج يبلغ 2 ميغابايت للإدخالات الفردية في ذاكرة التخزين المؤقت للبيانات (Data Cache). عندما يحاول تطبيقك تخزين بيانات أكبر من هذا الحد مؤقتًا، يطرح Next.js هذا الخطأ لمنع تدهور الأداء. يشرح هذا التقرير هذه المحدودية، وسبب وجودها، ويقدم حلولاً عملية لمعالجتها.

## فهم ذاكرة التخزين المؤقت لبيانات Next.js

### ما هي ذاكرة التخزين المؤقت لبيانات Next.js؟

ذاكرة التخزين المؤقت لبيانات Next.js هي ذاكرة تخزين مؤقت ثابتة من جانب الخادم تقوم بتخزين نتائج جلب البيانات عبر طلبات الخادم وعمليات النشر. وهي امتداد لواجهة برمجة تطبيقات `fetch` الأصلية التي تسمح لكل طلب على الخادم بتعيين دلالات التخزين المؤقت الثابتة الخاصة به.

### محدودية الـ 2 ميغابايت

وفقًا للكود المصدري لـ Next.js، هناك حد صارم يبلغ 2 ميغابايت لكل إدخال في ذاكرة التخزين المؤقت للبيانات:

```typescript
// FetchCache has upper limit of 2MB per-entry currently // لذاكرة التخزين المؤقت للجلب حد أقصى حالي يبلغ 2 ميغابايت لكل إدخال
const itemSize = JSON.stringify(data).length

if (
  ctx.fetchCache &&
  // we don't show this error/warning when a custom cache handler is being used // لا نعرض هذا الخطأ/التحذير عند استخدام معالج تخزين مؤقت مخصص
  // as it might not have this limit // لأنه قد لا يحتوي على هذا الحد
  !this.hasCustomCacheHandler &&
  itemSize > 2 * 1024 * 1024
) {
  if (this.dev) {
    throw new Error(
      `Failed to set Next.js data cache, items over 2MB can not be cached (${itemSize} bytes)`
    )
  }
  return
}
```

توجد هذه المحدودية لعدة أسباب:
1.  **الأداء**: يمكن أن تؤدي إدخالات ذاكرة التخزين المؤقت الكبيرة إلى تدهور الأداء عند القراءة من ذاكرة التخزين المؤقت أو الكتابة إليها.
2.  **استخدام الذاكرة**: يمكن أن تؤدي أحجام ذاكرة التخزين المؤقت المفرطة إلى مشكلات في الذاكرة، خاصة في البيئات الخالية من الخوادم (serverless).
3.  **كفاءة الشبكة**: تزيد الحمولات الكبيرة من أوقات النقل واستخدام النطاق الترددي.

## الخطأ المحدد الخاص بك

في حالتك، حدث الخطأ في مسار الصفحة الرئيسية (`app/(e-comm)/page.tsx`) عند محاولة جلب البيانات وتخزينها مؤقتًا:

```typescript
// السطر 50 في app/(e-comm)/page.tsx
const [products, supplierWithItems, promotions] = await Promise.all([
  fetchProducts(slug || ""),
  fetchSuppliersWithProducts(),
  getPromotions(),
]);
```

يبلغ حجم البيانات التي يتم تخزينها مؤقتًا حوالي 4.67 ميغابايت (4,676,126 بايت)، وهو ما يتجاوز حد الـ 2 ميغابايت بأكثر من الضعف.

## الحلول

### 1. تنفيذ ترقيم الصفحات وتقسيم البيانات إلى أجزاء (Pagination and Data Chunking)

**النهج الموصى به**: تقسيم مجموعات البيانات الكبيرة إلى أجزاء أصغر.

```typescript
// تعديل دوال جلب البيانات لقبول معلمات ترقيم الصفحات
export async function fetchProducts(slug: string, page = 1, pageSize = 20) {
  // تنفيذ ترقيم الصفحات في منطق جلب البيانات الخاص بك
  const skip = (page - 1) * pageSize;
  
  // جلب البيانات اللازمة للصفحة الحالية فقط
  const products = await db.product.findMany({
    where: { 
      published: true,
      ...(slug ? { supplier: { slug } } : {})
    },
    skip,
    take: pageSize,
    include: { supplier: true },
  });
  
  return products;
}
```

ثم قم بتحديث مكون الصفحة الخاص بك:

```typescript
// في مكون الصفحة الخاص بك
const [products, supplierWithItems, promotions] = await Promise.all([
  fetchProducts(slug || "", 1, 20), // جلب الصفحة الأولى فقط مبدئيًا
  fetchSuppliersWithProducts(),
  getPromotions(),
]);
```

### 2. استخدام العرض الديناميكي مع `no-store`

قم بإلغاء الاشتراك في التخزين المؤقت لمجموعات البيانات الكبيرة باستخدام خيار `no-store`:

```typescript
// في دوال جلب البيانات الخاصة بك
export async function fetchProducts(slug: string) {
  const res = await fetch(`/api/products?slug=${slug}`, { cache: 'no-store' });
  return res.json();
}
```

أو استخدم تكوين مقطع المسار:

```typescript
// في الجزء العلوي من ملف page.tsx الخاص بك
export const dynamic = 'force-dynamic';
```

### 3. تنفيذ معالج تخزين مؤقت مخصص (Custom Cache Handler)

يسمح لك Next.js بتنفيذ معالج تخزين مؤقت مخصص يمكنه التعامل مع إدخالات أكبر:

```typescript
// lib/custom-cache-handler.ts
import { CacheHandler, CacheHandlerContext, CacheHandlerValue } from 'next/dist/server/lib/incremental-cache';
import type { IncrementalCacheValue } from 'next/dist/server/response-cache';

export default class CustomCacheHandler extends CacheHandler {
  constructor(ctx: CacheHandlerContext) {
    super(ctx);
    // تهيئة مساحة تخزين ذاكرة التخزين المؤقت المخصصة الخاصة بك
  }

  async get(cacheKey: string, ctx: any): Promise<CacheHandlerValue | null> {
    // تنفيذ منطق "get" المخصص الخاص بك
  }

  async set(cacheKey: string, data: IncrementalCacheValue | null, ctx: any): Promise<void> {
    // تنفيذ منطق "set" المخصص الخاص بك بدون محدودية الـ 2 ميغابايت
  }
}
```

ثم قم بتكوين Next.js لاستخدام معالج ذاكرة التخزين المؤقت المخصص في `next.config.js`:

```javascript
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./lib/custom-cache-handler.ts'),
  },
}
```

### 4. تحسين هيكل البيانات

قلل حجم بياناتك عن طريق:

1.  **إزالة الحقول غير الضرورية**: قم بتضمين الحقول المطلوبة بالفعل فقط.
2.  **تحسين عناوين URL للصور**: استخدم معرفات الصور أو المسارات النسبية بدلاً من عناوين URL الكاملة.
3.  **تطبيع البيانات (Normalizing data)**: استخدم هياكل بيانات مطبعة لتجنب التكرار.

```typescript
// مثال على تحسين البيانات
function optimizeProductData(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageId: product.imageUrl.split('/').pop(), // تخزين المعرف فقط بدلاً من عنوان URL الكامل
    // تضمين الحقول الأساسية فقط
  };
}
```

### 5. تقسيم جلب البيانات حسب المكون

بدلاً من جلب جميع البيانات على مستوى الصفحة، قم بتقسيم مسؤوليات جلب البيانات بين المكونات:

```typescript
// في مكون الصفحة الخاص بك
export default async function Page({ params }) {
  const { slug } = params;
  
  // جلب البيانات الأساسية فقط على مستوى الصفحة
  const promotions = await getPromotions();
  
  return (
    <div>
      <SliderSection offers={promotions} />
      
      {/* كل مكون يجلب بياناته الخاصة */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductList slug={slug} />
      </Suspense>
      
      <Suspense fallback={<SuppliersLoading />}>
        <SuppliersList />
      </Suspense>
    </div>
  );
}
```

## خطة التنفيذ

1.  **إصلاح فوري**: تنفيذ ترقيم الصفحات لبيانات المنتج لتقليل حجم إدخال ذاكرة التخزين المؤقت.
2.  **على المدى القصير**: تحسين هياكل البيانات لتقليل حجم الحمولة الإجمالي.
3.  **على المدى المتوسط**: تقسيم مسؤوليات جلب البيانات بين المكونات.
4.  **على المدى الطويل**: النظر في تنفيذ معالج تخزين مؤقت مخصص إذا لزم الأمر.

## الخلاصة

يعد حد ذاكرة التخزين المؤقت البالغ 2 ميغابايت في Next.js قرار تصميم متعمد لضمان الأداء والاستقرار. من خلال تنفيذ الحلول الموصى بها، لا سيما ترقيم الصفحات وتحسين البيانات، يمكنك العمل ضمن هذه المحدودية مع الحفاظ على تطبيق تجارة إلكترونية عالي الأداء.

بالنسبة لمجموعات البيانات الكبيرة جدًا، من المحتمل أن يكون مزيج من هذه الأساليب ضروريًا. يعتبر ترقيم الصفحات مهمًا بشكل خاص لتطبيقات التجارة الإلكترونية حيث نادرًا ما يكون عرض جميع المنتجات مرة واحدة ضروريًا من منظور تجربة المستخدم.

## المراجع

1. [Next.js Documentation - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
2. [Next.js Documentation - Caching](https://nextjs.org/docs/app/deep-dive/caching)
3. [Next.js Source Code - Incremental Cache Implementation](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/incremental-cache/index.ts)
