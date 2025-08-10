
import type { ReactNode } from 'react';
import { MainLayout as Layout } from '@/components/layout/main-layout';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
