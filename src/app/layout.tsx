import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Inferno Shield Mobile',
  description: 'Comprehensive Fire Detection and Suppression System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
