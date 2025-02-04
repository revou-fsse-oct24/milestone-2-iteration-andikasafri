// import './globals.css';
// import { Inter } from 'next/font/google';
// import { Metadata } from 'next';
// import { Toaster } from '@/components/ui/toaster';
// import { ClientLayout } from '@/components/client-layout';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'NextShop - Your Premium Shopping Destination',
//   description: 'Discover a wide range of premium products at NextShop',
//   keywords: 'ecommerce, shopping, online store',
//   authors: [{ name: 'NextShop Team' }],
//   viewport: 'width=device-width, initial-scale=1',
//   robots: 'index, follow',
//   themeColor: '#ffffff',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ClientLayout>{children}</ClientLayout>
//         <Toaster />
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ClientLayout } from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextShop - Your Premium Shopping Destination",
  description: "Discover a wide range of premium products at NextShop",
  keywords: "ecommerce, shopping, online store",
  authors: [{ name: "NextShop Team" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
