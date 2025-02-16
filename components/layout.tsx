import { Separator } from '@radix-ui/react-separator';
import * as React from 'react';

import { AppSidebar } from '@/components/sidebar/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { ProtectedRoute } from '@/routes/protected-route';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className='flex h-screen w-screen'>
          <AppSidebar />
          <SidebarInset className='overflow-auto'>
            <header className='flex h-16 shrink-0 items-center gap-2'>
              <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className='hidden md:block'>
                      <BreadcrumbLink href='#'>
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='hidden md:block' />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            {/* Main Content */}
            <div className='w-full'>{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
