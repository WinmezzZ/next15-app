import { cookies } from 'next/headers';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarInset } from './sidebar-provider';

type ProviderProps = {
  children: React.ReactNode;
};

export default async function Providers({ children }: ProviderProps) {
  const cookieStore = await cookies();

  const sidebarState = cookieStore.get('sidebar:state')?.value;
  const sidebarWidth = cookieStore.get('sidebar:width')?.value;

  let defaultOpen = true;

  if (sidebarState) {
    defaultOpen = sidebarState === 'true';
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
      <AppSidebar>
        <AppSidebarInset>{children}</AppSidebarInset>
      </AppSidebar>
    </SidebarProvider>
  );
}
