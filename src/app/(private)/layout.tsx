import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen min-w-[375px] flex-col overflow-hidden">
        <AppHeader />
        <div className="bg-sidebar flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto rounded-tl-2xl bg-white">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
