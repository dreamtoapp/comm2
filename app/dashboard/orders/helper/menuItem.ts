import React from 'react';
import {
  AlertTriangle,
  FileText,
  ListOrdered,
  Newspaper,
  Package,
  Settings,
  ShoppingBasket,
  TagIcon,
  Timer,
  Truck,
  User2,
  Users,
  Wrench,
} from 'lucide-react';
import { FaCode } from 'react-icons/fa';

export type MenuItemType = {
  title: string;
  url: string;
  icon: React.ElementType;
  newTab?: boolean;
};

export const menuGroups: { label: string; items: MenuItemType[] }[] = [
  {
    label: 'إدارة الطلبات',
    items: [
      {
        title: 'إدارة الطلبات',
        url: '/dashboard/orders',
        icon: ListOrdered,
      },
      {
        title: 'جدولة الورديات',
        url: '/dashboard/shifts',
        icon: Timer,
      },
      {
        title: 'إدارة السائقين',
        url: '/dashboard/drivers',
        icon: Truck,
      },
    ],
  },
  {
    label: 'المنتجات والعروض',
    items: [
      {
        title: 'إدارة المنتجات',
        url: '/dashboard/products',
        icon: Package,
      },
      {
        title: 'العروض الترويجية',
        url: '/dashboard/offer',
        icon: TagIcon,
      },
      {
        title: 'إدارة الموردين',
        url: '/dashboard/suppliers',
        icon: ShoppingBasket,
      },
    ],
  },
  {
    label: 'العملاء والتواصل',
    items: [
      {
        title: 'مراسلات العملاء',
        url: '/dashboard/clientsubmission',
        icon: Users,
      },
      {
        title: 'النشرات الإخبارية',
        url: '/dashboard/clientnews',
        icon: Newspaper,
      },
      {
        title: 'المستخدمون والصلاحيات',
        url: '/dashboard/users',
        icon: User2,
      },
    ],
  },
  {
    label: 'الصيانة والإعدادات',
    items: [
      {
        title: 'الصيانة',
        url: '/dashboard/maintinance',
        icon: Wrench,
      },
      {
        title: 'الإعدادات',
        url: '/dashboard/setting',
        icon: Settings,
      },
      {
        title: 'القواعد والشروط',
        url: '/dashboard/rulesandcondtions',
        icon: FileText,
      },
    ],
  },
  {
    label: 'التنبيهات والتقارير',
    items: [
      {
        title: 'التنبيهات',
        url: '/dashboard/alerts',
        icon: AlertTriangle,
      },
      {
        title: 'تنبيهات فشل الدعم الفوري',
        url: '/dashboard/fallback-alerts',
        icon: AlertTriangle,
      },
      // Future: add financial reports, analytics, etc.
    ],
  },
  {
    label: 'التطوير',
    items: [
      {
        title: 'دليل الإدارة',
        url: '/dashboard/guidelines',
        icon: FaCode,
      },
      {
        title: 'لوحة المطور',
        url: 'https://www.dreamto.app',
        icon: FaCode,
        newTab: true,
      },
    ],
  },
];
