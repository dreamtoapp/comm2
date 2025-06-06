# 11. دعم تعدد العملاء (Multi-Tenancy)

## الفكرة الرئيسية
تحويل النظام ليخدم عدة عملاء (متاجر) من خلال قاعدة بيانات واحدة أو أكثر، مع عزل إعدادات وبيانات كل عميل ديناميكيًا بدل الاعتماد على متغيرات البيئة الثابتة.

## الأهمية
- تمكين بيع النظام كـ SaaS (منصة متاجر متعددة).
- مرونة في إدارة إعدادات كل عميل (API Keys, دفع، شعار، ألوان... إلخ).
- أمان أعلى وعزل بيانات قوي.
- سهولة التوسع وإضافة عملاء جدد دون إعادة نشر الكود.

## خطوات التنفيذ
1. **تصميم قاعدة البيانات**
   - إنشاء جدول `Clients` (أو `Tenants`) يحتوي على جميع الإعدادات الخاصة بكل عميل.
   - ربط كل بيانات المتجر (منتجات، طلبات، مستخدمين...) بـ `clientId`.
2. **تهيئة الخدمات ديناميكيًا**
   - عند كل طلب، تحديد العميل (عن طريق الدومين، subdomain، أو رمز في JWT).
   - تحميل إعدادات العميل من قاعدة البيانات (API Keys، إعدادات الدفع، ...).
   - تهيئة الخدمات (Pusher، الدفع، إلخ) ديناميكيًا لكل عميل.
3. **عزل البيانات**
   - التأكد أن كل استعلام في قاعدة البيانات مقيد بـ `clientId`.
   - تطبيق سياسات أمان مشددة لمنع تسرب البيانات بين العملاء.
4. **لوحة تحكم إعدادات العملاء**
   - بناء واجهة لإدارة إعدادات كل عميل (تعديل مفاتيح، شعار، ألوان، إلخ).
5. **احتفاظ بمتغيرات البيئة العامة فقط**
   - استخدام `.env` فقط للأسرار العامة (وليس ما يخص كل عميل).
6. **تحسين الأداء**
   - استخدام cache (Redis) لتحميل إعدادات العملاء بسرعة.
7. **اختبارات أمان وتوافق**
   - اختبار عزل البيانات، اختبار الأداء مع زيادة عدد العملاء.

## ملاحظة تفصيلية: كيفية تحديد العميل من الدومين (Domain/Subdomain)

### 1. استخراج العميل من الـ Subdomain (الأكثر شيوعًا)
- إذا كان لكل عميل نطاق فرعي خاص:
    - client1.yourdomain.com → clientId = client1
    - client2.yourdomain.com → clientId = client2

#### مثال عملي (Next.js Middleware):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname; // مثال: client1.yourdomain.com
  const mainDomain = 'yourdomain.com';

  // إزالة النطاق الأساسي للحصول على الـ subdomain
  let clientSubdomain = hostname.replace(`.${mainDomain}`, '');

  // معالجة الحالات الخاصة (www أو النطاق الرئيسي)
  if (clientSubdomain === hostname) {
    clientSubdomain = 'default'; // أو تعامل كنطاق رئيسي
  }

  // الآن clientSubdomain هو معرف العميل (clientId)
  // يمكنك جلب الإعدادات من قاعدة البيانات:
  // db.clients.find({ subdomain: clientSubdomain })

  // مثال: تمرير المعرف في الهيدر
  const res = NextResponse.next();
  res.headers.set('x-client-id', clientSubdomain);
  return res;
}
```

#### مثال في API Route أو getServerSideProps:
```typescript
export async function getServerSideProps({ req }) {
  const host = req.headers.host; // مثال: client1.yourdomain.com
  const mainDomain = 'yourdomain.com';

  let clientSubdomain = host.replace(`.${mainDomain}`, '');
  if (clientSubdomain === host) {
    clientSubdomain = 'default';
  }

  // استخدم clientSubdomain لجلب إعدادات العميل
  const clientConfig = await db.clients.find({ subdomain: clientSubdomain });
  // ...
}
```

### 2. دعم النطاقات المخصصة (Vanity Domains)
- إذا سمحت للعملاء باستخدام نطاقاتهم الخاصة (store1.com):
    - خزّن النطاق الكامل في جدول العملاء وابحث عنه مباشرة:
```typescript
const clientConfig = await db.clients.find({ domain: hostname });
```

### 3. نصائح الأمان والمعالجة:
- تحقق دائمًا من صحة الـ subdomain/domain المستخرج.
- إذا لم يُتعرف على النطاق، وجّه المستخدم لصفحة هبوط أو أظهر رسالة خطأ.
- لا تثق مباشرة بأي مدخلات من المستخدم—دائمًا تحقق من قاعدة البيانات.

## ملاحظة حول اختيار قاعدة البيانات (Prisma + MongoDB)

### لماذا Prisma مع MongoDB خيار جيد للبداية؟
- سرعة في بناء المنتج الأولي (MVP) وقابلية التوسع السريع.
- مرونة عالية في هيكل البيانات (schema flexibility) مع دعم Prisma للـ TypeScript وNext.js.
- تكلفة منخفضة وسهولة الإعداد (MongoDB Atlas/Cloud).
- سهولة إدارة العلاقات البسيطة بين الجداول (Collections).
- مجتمع ودعم قوي لكلا التقنيتين.

### متى قد تحتاج للتغيير لاحقًا؟
- إذا أصبحت العمليات المالية أو التحليلية معقدة جدًا (تحتاج ACID قوي أو استعلامات SQL معقدة).
- إذا أصبحت العلاقات بين البيانات متداخلة ومعقدة جدًا.
- إذا تضخمت البيانات وتحتاج إلى أداء بحث وتحليل متقدم (حينها يمكن دمج ElasticSearch أو Data Warehouse).

### نصائح عملية:
- راقب الأداء واستخدم Redis للكاش عند الحاجة.
- اهتم بعزل بيانات العملاء (clientId) في كل استعلام.
- استثمر في الفهارس (Indexes) لتحسين سرعة الاستعلامات.
- استخدم خدمات مساندة (Cloudinary/S3 للصور، Stripe للدفع، إلخ) حسب الحاجة.

**الخلاصة:**
ابدأ بـ Prisma + MongoDB وأنت مطمئن. هو خيار عملي ومرن لمعظم مشاريع SaaS الناشئة، ويمكنك دائمًا الترقية أو الدمج مع تقنيات أخرى مع نمو المشروع.

## AI Prompt لتنفيذ المهمة
```
أنت مهندس معماري للبرمجيات كخدمة (SaaS)/متعدد المستأجرين. قم بإعادة هيكلة منصة تجارة إلكترونية مبنية على Next.js لدعم بنية متعددة العملاء (متعددة المستأجرين). قم بتخزين جميع الإعدادات الخاصة بالعميل (مفاتيح API، الدفع، العلامة التجارية، إلخ) في جدول قاعدة بيانات (العملاء). قم بتحميل هذه الإعدادات ديناميكيًا لكل طلب بناءً على النطاق/النطاق الفرعي أو الرمز المميز. تأكد من عزل البيانات الصارم بواسطة معرف العميل (clientId) في جميع الاستعلامات. قم ببناء واجهة مستخدم للمسؤول لإدارة تكوينات العميل. استخدم TypeScript، Prisma، وقم بالتحسين للأمان والأداء (ضع في اعتبارك التخزين المؤقت باستخدام Redis). يجب أن يخزن ملف .env الأسرار العامة فقط، وليس البيانات الخاصة بكل عميل.
