"use client";

import React, { useState } from 'react';
import { Search, List, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (time) params.set('time', time);
    router.push(`/opskrifter?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#101928] font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 py-20">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[#101928]">
            Find din næste livret
          </h1>
          <div className="hidden md:block">
            <p className="text-lg text-gray-600">
              Udforsk tusindvis af lækre opskrifter og madplaner til din hverdag
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-5xl mb-12 relative z-10">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center justify-center">
            
            {/* Input: Dish/Ingredient */}
            <div className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              query 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
            }`}>
              <Search className={`w-3 h-3 ${query ? 'text-gray-300' : 'text-gray-400'}`} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ret eller ingrediens" 
                className={`bg-transparent outline-none placeholder-gray-500 w-32 ${
                  query ? 'text-white placeholder-gray-300' : 'text-gray-800'
                }`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Input: Category */}
            <div className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
              <List className="w-3 h-3 text-gray-400" />
              <input 
                type="text" 
                list="categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Kategori"
                className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-24"
              />
              {category && (
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <datalist id="categories">
                <option value="Morgenmad" />
                <option value="Frokost" />
                <option value="Aftensmad" />
                <option value="Dessert" />
                <option value="Snack" />
                <option value="Drikkevarer" />
              </datalist>
            </div>

            {/* Input: Time */}
            <div className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
              <Clock className="w-3 h-3 text-gray-400" />
              <input 
                type="number" 
                min="0"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Max tid (min)" 
                className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {time && (
                <button
                  type="button"
                  onClick={() => setTime('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Button */}
            {(query || category || time) && (
              <button 
                type="submit" 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors"
              >
                <span>Søg</span>
              </button>
            )}
          </form>
        </div>

        {/* Counter */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
           <div className="text-center">
            <span className="text-xl md:text-2xl font-semibold inline-flex items-center gap-1">
              <span className="tracking-widest">12.450</span>
              <span className="font-normal text-gray-600 ml-1">opskrifter er tilføjet</span>
            </span>
           </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
