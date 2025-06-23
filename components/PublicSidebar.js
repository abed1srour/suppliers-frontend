'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Sun,
  Zap,
  Battery,
  Package,
  ChevronRight,
  LogIn,
} from 'lucide-react';

const categories = [
  { name: 'Panel', path: '/?category=Panel', icon: Sun },
  { name: 'Inverter', path: '/?category=Inverter', icon: Zap },
  { name: 'Battery', path: '/?category=Battery', icon: Battery },
];

export default function Sidebar({ selected, setSelected, isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lastUpdate, setLastUpdate] = useState(null);

  // Set default to Inverter on mount if not selected
  useEffect(() => {
    if (!selected && setSelected) {
      setSelected('Inverter');
      router.replace('/?category=Inverter');
    }
  }, []);

  useEffect(() => {
    async function fetchLastUpdate() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/last-update`);
        const data = await res.json();
        setLastUpdate(data.updatedAt);
      } catch (e) {
        setLastUpdate(null);
      }
    }
    fetchLastUpdate();
  }, []);

  const handleCategorySelect = (categoryName, path) => {
    setSelected && setSelected(categoryName);
    router.push(path);
    setIsSidebarOpen(false);
  };

  const showHamburger = !isSidebarOpen;

  // Format date as 'YYYY-MM-DD HH:mm'
  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  // Sidebar classes: fixed and h-screen always on desktop, only when open on mobile
  const sidebarClass = `
    flex flex-col justify-between
    bg-[#0a0f1c] text-white border-r border-blue-900 shadow-xl
    w-72
    ${isSidebarOpen ? 'fixed h-screen z-50 top-0 left-0' : 'hidden'}
    transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}
    md:static md:translate-x-0 md:z-auto md:flex md:h-screen
  `;

  return (
    <>
      {/* Hamburger Button (mobile only) */}
      {showHamburger && (
        <button
          className="fixed top-4 left-4 z-50 text-white bg-[#0a0f1c] border border-blue-900 p-2.5 rounded-lg hover:border-blue-500 hover:bg-blue-950 transition-all shadow-lg backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar and Overlay: fixed, full height, overlays content, consistent color */}
      <div className="h-screen flex flex-col justify-between md:h-screen md:flex">
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div className={sidebarClass}>
          <div>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-blue-900">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-blue-300 font-semibold">Last Update</span>
                  <span className="text-white text-sm font-bold">{formatDate(lastUpdate)}</span>
                </div>
              </div>
              {/* X button only on mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-blue-950 transition md:hidden"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main content with extra bottom padding */}
            <div className="flex flex-col h-[calc(100%-65px)] pb-20">
              {/* Categories */}
              <div className="px-3 mb-4 mt-6">
                <h3 className="text-blue-400 text-xs font-semibold uppercase px-3 mb-2 tracking-wide">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((cat) => {
                    const isActive = selected === cat.name;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.name, cat.path)}
                        className={`w-full flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-lg transition
                          ${isActive ? 'bg-blue-700 text-white border-l-4 border-blue-400 shadow-lg' : 'text-blue-200 hover:bg-blue-950 hover:text-white'}`}
                      >
                        <Icon size={18} className={isActive ? 'text-white' : 'text-blue-400'} />
                        <span>{cat.name}</span>
                        {isActive && <ChevronRight size={16} className="ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
          {/* Login Button at the Bottom (always visible) */}
          <div className="p-4 bg-[#0a0f1c] border-t border-blue-900 w-full">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
