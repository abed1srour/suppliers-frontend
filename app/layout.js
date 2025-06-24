import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import ClientLayout from "../components/ClientLayout";
import PerformanceMonitor from "../components/PerformanceMonitor";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Srour Solar Power",
  description: "Supplier Portal for Solar Products",
  icons: {
    icon: "/logo.png",
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
      { protocol: '*', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1c] text-white`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <PerformanceMonitor />
      </body>
    </html>
  );
}
