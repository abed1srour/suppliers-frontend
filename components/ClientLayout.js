"use client";
import PublicSidebar from "./PublicSidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");
  const hideSidebar = isAdminRoute || isLoginRoute;
  return (
    <div className="relative min-h-screen">
      {/* Desktop layout: sidebar fixed, main content scrolls */}
      {!hideSidebar && (
        <>
          <div className="hidden md:block">
            <div className="fixed top-0 left-0 h-screen w-72 z-50">
              <PublicSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </div>
          <div className="md:ml-72 min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col min-h-screen">{children}</main>
          </div>
          {/* Mobile Sidebar Overlay (always rendered, only visible when open) */}
          <div className="md:hidden">
            <PublicSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </>
      )}
      {hideSidebar && (
        <main className="flex-1 min-h-screen flex flex-col">{children}</main>
      )}
    </div>
  );
} 