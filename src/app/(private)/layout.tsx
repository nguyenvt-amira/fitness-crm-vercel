import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-neutral-100/40">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
