import React from 'react';
import { ChefHat, Search, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#101928]">
          <ChefHat className="w-8 h-8" />
          <span>SimpelSpis</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <Link href="/opskrifter" className="hover:text-black transition-colors">Opskrifter</Link>
          <Link href="#" className="hover:text-black transition-colors">Kategorier</Link>
          <Link href="#" className="hover:text-black transition-colors">Om os</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}

