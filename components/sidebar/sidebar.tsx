'use client';

import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Box,
  IndianRupee,
  LayoutDashboard,
  ScrollText,
  Truck,
  Users,
} from 'lucide-react';
import * as React from 'react';

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

  secondaryItems: [
    {
      name: 'Sales',
      url: '/sales',
      icon: IndianRupee,
    },
    {
      name: 'Inventory',
      url: '/inventory',
      icon: Box,
    },
    {
      name: 'Customers',
      url: '/customers',
      icon: Users,
    },
    {
      name: 'Suppliers',
      url: '/suppliers',
      icon: Truck,
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
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.secondaryItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
