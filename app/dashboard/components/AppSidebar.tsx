'use client';

import React, { useState, ElementType } from 'react'; // Import ElementType

import { Home, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from '@/components/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import { menuGroups } from '../helpers/mainMenu';

// Define type for menu items
interface MenuItem { // Renamed BaseMenuItem to MenuItem
  title: string;
  url: string;
  icon: ElementType; // Type for React component like lucide icons
  children?: MenuItem[]; // Make children optional directly on MenuItem
}

export default function AppSidebar() {
  // For now, hardcode RTL (right side) for Arabic; in future, detect from i18n or context
  const side: 'left' | 'right' = 'right';
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<number[]>([]);

  const toggleGroup = (idx: number) => {
    setCollapsedGroups((groups) =>
      groups.includes(idx) ? groups.filter((i) => i !== idx) : [...groups, idx],
    );
  };

  return (
    <Sidebar side={side} className='flex h-screen flex-col border-r bg-background rtl:text-right'>
      <SidebarHeader className='flex flex-col items-center gap-2 border-b bg-background p-4'>
        <div className='mb-1 flex w-full items-center justify-center gap-4'>
          <Link
            href='/'
            className='flex items-center justify-center rounded-lg p-2 transition hover:bg-accent'
          >
            <Home className='h-6 w-6 text-primary' />
          </Link>
          <Link
            href='/dashboard'
            className='flex items-center justify-center rounded-lg p-2 transition hover:bg-accent'
          >
            <LayoutDashboard className='h-6 w-6 text-primary' />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className='flex-1 overflow-y-auto p-2'>
        {menuGroups.map((group, i) => {
          const isCollapsed = collapsedGroups.includes(i);
          return (
            <SidebarGroup key={i} className='mb-4'>
              <button
                className='flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:text-primary'
                onClick={() => toggleGroup(i)}
                aria-expanded={!isCollapsed}
                aria-controls={`sidebar-group-${i}`}
              >
                <span className='text-right'>{group.label}</span>
                <span className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <ul
                id={`sidebar-group-${i}`}
                className={`space-y-1 overflow-hidden transition-all duration-200 ${isCollapsed ? 'max-h-0 opacity-60' : 'max-h-96 opacity-100'}`}
                style={{ direction: 'rtl' }}
              >
                {group.items.map((item: MenuItem) => { // Use simplified MenuItem type
                  return ( // Add return statement
                    <React.Fragment key={item.url}>
                      <li>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${pathname === item.url ? 'bg-accent font-bold text-accent-foreground' : ''}`}
                        >
                          <item.icon className='h-5 w-5 text-primary' />
                          <span className='flex-1'>{item.title}</span>
                        </Link>
                      </li>
                      {/* Render sub-menu if available */}
                      {item.children && item.children.length > 0 && ( // Check directly
                        <ul className='max-h-[400px] space-y-1 overflow-y-auto py-1 pl-8 pr-2'>
                          {item.children.map((child) => (
                            <li key={child.url}>
                              <Link
                                href={child.url}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 ${pathname === child.url ? 'bg-blue-100 font-bold text-blue-800' : ''}`}
                              >
                                <child.icon className='h-4 w-4 text-blue-500' />
                                <span>{child.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </React.Fragment>
                  ); // Close return statement
                })}
              </ul>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className='border-t p-4'>
        <div className='w-full text-center text-xs text-muted-foreground'>
          {' '}
          {new Date().getFullYear()} www.amwag.com
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
