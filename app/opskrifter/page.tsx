import React from 'react';
import Link from 'next/link';
import { Clock, Users, ChefHat, ArrowRight, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllRecipes } from '../../lib/recipes';

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = (params.q as string)?.toLowerCase() || '';
  const categoryParam = (params.category as string)?.toLowerCase() || '';
  const timeParam = (params.time as string)?.toLowerCase() || '';

  const allRecipes = getAllRecipes();

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesQuery = recipe.title.toLowerCase().includes(q) || recipe.description.toLowerCase().includes(q);
    const matchesCategory = categoryParam ? recipe.category.toLowerCase().includes(categoryParam) : true;
    
    // Simple time filtering: checks if numeric value is <= search term
    let matchesTime = true;
    if (timeParam) {
      const recipeMinutes = parseInt(recipe.time);
      const searchMinutes = parseInt(timeParam);
      if (!isNaN(searchMinutes) && !isNaN(recipeMinutes)) {
        matchesTime = recipeMinutes <= searchMinutes;
      }
    }

    return matchesQuery && matchesCategory && matchesTime;
  });

  const getQueryString = (excludeKey: string) => {
    const newParams = new URLSearchParams();
    if (q && excludeKey !== 'q') newParams.set('q', q);
    if (categoryParam && excludeKey !== 'category') newParams.set('category', categoryParam);
    if (timeParam && excludeKey !== 'time') newParams.set('time', timeParam);
    return newParams.toString() ? `?${newParams.toString()}` : '/opskrifter';
  };

  return (
    <div className="min-h-screen bg-white text-[#101928] font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Alle Opskrifter</h1>
          <p className="text-gray-600 max-w-2xl mb-4">
            Gå på opdagelse i vores samling af lækre opskrifter. Her finder du alt fra hurtige hverdagsretter til imponerende gæstemad.
          </p>
          
          {(q || categoryParam || timeParam) && (
             <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="font-semibold text-gray-900 mr-2">Søgeresultater:</span>
                
                {q && (
                  <Link href={`/opskrifter${getQueryString('q')}`} className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors">
                    <span>"{q}"</span>
                    <X className="w-3 h-3 text-gray-300 group-hover:text-white" />
                  </Link>
                )}
                
                {categoryParam && (
                  <Link href={`/opskrifter${getQueryString('category')}`} className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                    <span>Kategori: {categoryParam}</span>
                    <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                )}
                
                {timeParam && (
                  <Link href={`/opskrifter${getQueryString('time')}`} className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                    <span>Max tid: {timeParam} min</span>
                    <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                )}
                
                <Link href="/opskrifter" className="ml-auto md:ml-2 text-gray-500 hover:text-black underline decoration-gray-300 hover:decoration-black transition-colors text-xs font-medium">
                  Ryd filtre
                </Link>
             </div>
          )}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <Link 
                href={`/opskrifter/${recipe.id}`} 
                key={recipe.id}
                className="group border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 block"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {recipe.category}
                  </span>
                  <div className="bg-gray-50 p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                    <ChefHat className="w-5 h-5 text-gray-400 group-hover:text-black" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition-colors">
                  {recipe.title}
                </h2>
                
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {recipe.time} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {recipe.difficulty}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">Ingen opskrifter fundet</h3>
            <p className="text-gray-500">Prøv at søge efter noget andet eller fjern dine filtre.</p>
            <Link href="/opskrifter" className="inline-block mt-4 text-black font-semibold underline">Se alle opskrifter</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
