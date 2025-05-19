// app/seo/constant/technical-tooltip-content.ts
export const TechnicalSeoFormTooltips = {
  securityHeaders: "رؤوس الأمان (مثال: 'X-Content-Type-Options: nosniff'). تساعد في حماية موقعك من بعض الهجمات.",
  preloadAssets: "الأصول التي يتم تحميلها مسبقًا (مثال: '/fonts/myfont.woff2'). يمكن أن يحسن سرعة تحميل الصفحة.",
  httpEquiv: "إعدادات HTTP-Equiv (مثال: 'content-language: ar-SA'). توفر معلومات إضافية للمتصفح."
};

export const SecurityHeaderTemplates = [
  { label: "Content Security Policy (Report Only)", value: "Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report-endpoint" },
  { label: "Content Security Policy (Strict)", value: "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" },
  { label: "X-Content-Type-Options", value: "X-Content-Type-Options: nosniff" },
  { label: "X-Frame-Options (Deny)", value: "X-Frame-Options: DENY" },
  { label: "X-Frame-Options (SameOrigin)", value: "X-Frame-Options: SAMEORIGIN" },
  { label: "Strict-Transport-Security (HSTS)", value: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload" },
  { label: "Referrer-Policy (Strict)", value: "Referrer-Policy: strict-origin-when-cross-origin" },
  { label: "Permissions-Policy (Basic)", value: "Permissions-Policy: geolocation=(), microphone=(), camera=()" },
];

export const HttpEquivTemplates = [
  { label: "Content Language (Arabic)", value: "content-language: ar-SA" },
  { label: "Content Language (English)", value: "content-language: en-US" },
  { label: "Content Type (UTF-8)", value: "Content-Type: text/html; charset=utf-8" },
  { label: "X-UA-Compatible (Edge)", value: "X-UA-Compatible: IE=edge" },
  { label: "Refresh (Redirect after 5s)", value: "refresh: 5;url=https://example.com/" },
];
