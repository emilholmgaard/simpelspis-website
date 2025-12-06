import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-[#101928] font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-8 py-12 w-full flex flex-col items-center justify-center">
        <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Opskrift ikke fundet</h1>
        <p className="text-gray-600 mb-8 text-center">
          Den opskrift du leder efter findes ikke.
        </p>
        <Link 
          href="/opskrifter" 
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-semibold"
        >
          Se alle opskrifter
        </Link>
      </main>

      <Footer />
    </div>
  );
}

