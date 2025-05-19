// Main menu items for dashboard sidebar (Restructured for enhanced UX)
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Gift,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Newspaper,
  Package,
  PieChart,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Target,
  Timer,
  Truck,
  Users,
  Users2,
  Wrench,
  XCircle,
} from 'lucide-react';

// Define type for menu items (assuming it's defined in AppSidebar.tsx or a shared types file)
// For clarity here if this file were standalone:
/*
interface MenuItem {
  title: string;
  url: string;
  icon: ElementType;
  children?: MenuItem[];
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}
*/

export const menuGroups = [
  {
    label: 'نظرة عامة', // Overview
    items: [
      { title: 'لوحة التحكم الرئيسية', url: '/dashboard', icon: LayoutDashboard },
      { title: 'المتجر الإلكتروني', url: '/', icon: Home }, // Link to e-commerce homepage
    ],
  },
  {
    label: 'إدارة الطلبات', // Order Management
    items: [
      { title: 'إدارة الطلبات', url: '/dashboard/orders-management', icon: Layers }, // Main view

      { title: 'قيد الانتظار', url: '/dashboard/orders-management/status/pending', icon: Clock },
      { title: 'في الطريق', url: '/dashboard/orders-management/status/in-way', icon: Truck },
      { title: 'تم التسليم', url: '/dashboard/orders-management/status/delivered', icon: CheckCircle },
      { title: 'ملغي', url: '/dashboard/orders-management/status/canceled', icon: XCircle },




    ],
  },
  {
    label: 'نظرة عامة على التقارير', // Reports Overview
    items: [
      { title: 'نظرة عامة على التقارير', url: '/dashboard/reports', icon: PieChart },
    ],
  },
  {
    label: 'إدارة العمليات', // Operations Management
    items: [
      { title: 'إدارة السائقين', url: '/dashboard/drivers', icon: Truck },
      { title: 'جدولة الورديات', url: '/dashboard/shifts', icon: Timer },
    ],
  },
  {
    label: 'إدارة المنتجات', // Product Catalog
    items: [
      { title: 'المنتجات', url: '/dashboard/products-control', icon: Package },
      { title: 'الأصناف', url: '/dashboard/categories', icon: LayoutGrid },
      { title: 'الموردون', url: '/dashboard/suppliers', icon: ShoppingBasket },
    ],
  },
  {
    label: 'التسويق والعروض', // Marketing & Promotions
    items: [
      { title: 'إدارة العروض', url: '/dashboard/promotions', icon: Gift },
      { title: 'النشرات الإخبارية', url: '/dashboard/clientnews', icon: Newspaper },
      { title: 'الدليل والإرشادات', url: '/seo/documentation', icon: FileText },
    ],
  },
  {
    label: 'إدارة العملاء', // Customer Management
    items: [
      { title: 'قائمة العملاء', url: '/dashboard/users', icon: Users2 },
      { title: 'مراسلات العملاء', url: '/dashboard/clientsubmission', icon: Users },
    ],
  },
  {
    label: 'المصروفات', // Financials
    items: [
      { title: 'المصروفات', url: '/dashboard/expenses', icon: CreditCard },
    ],
  },
  {
    label: 'النظام والإعدادات', // System & Settings
    items: [
      { title: 'الإعدادات العامة', url: '/dashboard/settings', icon: Settings },
      { title: 'المستخدمون والصلاحيات', url: '/dashboard/users-permissions', icon: ShieldCheck },
      { title: 'التنبيهات', url: '/dashboard/alerts', icon: AlertTriangle },
      { title: 'الدعم الفني', url: '/dashboard/maintinance', icon: Wrench },
      { title: 'الدليل والإرشادات', url: '/dashboard/guidelines', icon: Info },
    ],
  },
  {
    label: 'إدارة الـ SEO', // SEO Management
    items: [
      { title: 'تحليلات SEO', url: '/dashboard/seo', icon: Target },
      { title: 'SEO الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
      { title: 'SEO من نحن', url: '/dashboard/seo/about', icon: Info },
      { title: 'SEO المدونة', url: '/dashboard/seo/blog', icon: Newspaper },
      { title: 'SEO المنتجات', url: '/dashboard/seo/product', icon: Package },
      { title: 'SEO العروض', url: '/dashboard/seo/promotion', icon: Gift },
      { title: 'SEO الأصناف', url: '/dashboard/seo/category', icon: LayoutGrid },
    ],
  },
];
