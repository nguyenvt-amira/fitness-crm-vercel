import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col gap-16">
      <AppHeader />
      <SidebarProvider>
        <AppSidebar />
        <main className="mt-16 w-full overflow-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
}
