import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-[#101928]">SimpelSpis</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Din daglige inspiration til nem og lækker madlavning. Find opskrifter, der passer til din hverdag.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#101928]">Udforsk</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-black">Morgenmad</Link></li>
              <li><Link href="#" className="hover:text-black">Frokost</Link></li>
              <li><Link href="#" className="hover:text-black">Aftensmad</Link></li>
              <li><Link href="#" className="hover:text-black">Dessert</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#101928]">Om SimpelSpis</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-black">Om os</Link></li>
              <li><Link href="#" className="hover:text-black">Karriere</Link></li>
              <li><Link href="#" className="hover:text-black">Kontakt</Link></li>
              <li><Link href="#" className="hover:text-black">Partner</Link></li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#101928]">Følg med</h4>
            <div className="flex gap-4 mb-6">
              <Link href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2025 SimpelSpis. Alle rettigheder forbeholdes.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-black">Privatlivspolitik</Link>
            <Link href="#" className="hover:text-black">Vilkår</Link>
            <Link href="#" className="hover:text-black">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

