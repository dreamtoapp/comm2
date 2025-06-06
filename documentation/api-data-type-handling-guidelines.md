# إرشادات سلامة الأنواع في المشروع: التعامل مع `null` مقابل `undefined`

## التعامل مع `null` مقابل `undefined` في بيانات API

عند جلب البيانات من واجهة برمجة تطبيقات (API)، قد تتلقى حقولًا بقيم `null`، ولكن تعريفات أنواع TypeScript الخاصة بك غالبًا ما تتوقع `undefined` بدلاً من `null` للحقول الاختيارية. يمكن أن يتسبب هذا عدم التطابق في أخطاء بناء أو أخطاء وقت التشغيل.

### أفضل ممارسة
قم دائمًا بمعالجة البيانات المجلبة مسبقًا لتحويل حقول `null` إلى `undefined` قبل تحديث حالة React أو تمرير البيانات إلى المكونات.

#### مثال: حقل شعار المورد (Supplier Logo)
إذا تم تعريف نوع `Supplier` على النحو التالي:
```ts
interface Supplier {
  id: string;
  name: string;
  logo?: string; // يتوقع string أو undefined
  type?: string;
}
```
ولكن قد تُرجع الواجهة الخلفية/API القيمة `logo: null`، يجب عليك تعيين البيانات (map) على هذا النحو:
```ts
fetchSuppliers().then((data) => {
  const fixedData = data.map((s) => ({
    ...s,
    logo: s.logo ?? undefined, // تحويل null إلى undefined
  }));
  setSuppliers(fixedData);
});
```

هذا يضمن توافق الأنواع ويمنع أخطاء TypeScript.

---

**ملخص:**
- قم دائمًا بتنقية بيانات API لتتناسب مع أنواع الواجهة الأمامية الخاصة بك.
- فضّل `undefined` على `null` للحقول الاختيارية في واجهات TypeScript.
- استخدم التعيين (mapping) مع عامل الدمج الصفري (`?? undefined`) لتحويل `null` إلى `undefined` كما هو موضح أعلاه.

> حافظ على قاعدة الكود الخاصة بك آمنة من حيث النوع وخالية من الأخطاء باتباع هذا النمط في جميع أنحاء مشروعك.
