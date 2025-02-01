'use client';

import * as React from 'react';
import {
  Box,
  IndianRupee,
  LayoutDashboard,
  ReceiptText,
  ScrollText,
  Users,
} from 'lucide-react';

// import { NavProjects } from '@/components/nav-projects';
// import { NavSecondary } from '@/components/nav-secondary';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { useAppSelector } from '@/store/hooks';
import { getUserData } from '@/store/slice/authSlice';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/public/srd-logo.webp',
  },
  dashboard: [
    {
      name: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
    },
  ],
  navMain: [
    {
      title: 'Invoice Management',
      url: '#',
      icon: ReceiptText,
      isActive: true,
      items: [
        {
          title: 'Invoice',
          url: '#',
        },
        {
          title: 'Add Invoice',
          url: '#',
        },
      ],
    },
    {
      title: 'Inventory Management',
      url: '#',
      icon: Box,
      items: [
        {
          title: 'View Inventory',
          url: '#',
        },
        {
          title: 'Add Item',
          url: '#',
        },
      ],
    },
    {
      title: 'Customer Management',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Customers',
          url: '#',
        },
        {
          title: 'Add Customer',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Sales',
      url: '#',
      icon: IndianRupee,
    },
    {
      name: 'Purchases',
      url: '#',
      icon: ScrollText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector(getUserData);
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src='/srd-logo.webp' alt='logo' />
                  </Avatar>
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>SRD Pvt</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.dashboard} />
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
