import React from 'react';
import { Share2, Facebook, Twitter, Plus, Minus, Printer } from 'lucide-react';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getRecipeById } from '../../../lib/recipes';

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-8 w-full">
        <div className="space-y-6">
          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl text-[#2C3338] font-bold">
              {recipe.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Tags and Share */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {recipe.category}
            </div>
            {recipe.tags && recipe.tags.map((tag, idx) => (
              <div key={idx} className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {tag}
              </div>
            ))}
            <div className="flex gap-4 ml-auto">
              <button className="text-gray-600 hover:text-black transition-colors" aria-label="Del på Facebook">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-black transition-colors" aria-label="Del">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-black transition-colors" aria-label="Del på Twitter">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-black transition-colors" aria-label="Print">
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex gap-12">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-xl font-medium text-[#2C3338]">{recipe.time} min</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Sværhedsgrad</p>
              <p className="text-xl font-medium text-[#2C3338]">{recipe.difficulty}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Portioner</p>
              <p className="text-xl font-medium text-[#2C3338]">{recipe.servings}</p>
            </div>
          </div>

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#2C3338] mb-4">Næringsindhold per styk</h3>
              <div className="grid grid-cols-6 gap-0 justify-start">
                {recipe.nutrition.calories && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.calories}</p>
                    <p className="text-[10px] text-gray-600">Kalorier</p>
                  </div>
                )}
                {recipe.nutrition.fiber && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.fiber}</p>
                    <p className="text-[10px] text-gray-600">Fiber</p>
                  </div>
                )}
                {recipe.nutrition.protein && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.protein}</p>
                    <p className="text-[10px] text-gray-600">Protein</p>
                  </div>
                )}
                {recipe.nutrition.carbs && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.carbs}</p>
                    <p className="text-[10px] text-gray-600">Kulhydrater</p>
                  </div>
                )}
                {recipe.nutrition.fats && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.fats}</p>
                    <p className="text-[10px] text-gray-600">Fedt</p>
                  </div>
                )}
                {recipe.nutrition.sugar && (
                  <div className="flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full bg-gray-100 space-y-0">
                    <p className="text-base font-medium text-gray-800 leading-none">{recipe.nutrition.sugar}</p>
                    <p className="text-[10px] text-gray-600">Sukker</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions and Ingredients Side by Side */}
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Instructions Section - Left */}
            <div className="space-y-8">
              <h2 className="text-2xl text-[#2C3338] font-bold">Fremgangsmåde</h2>
              <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 text-[#2C3338]">{step.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients Section - Right */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-[#2C3338] font-bold">Ingredienser</h2>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-black text-white">World</span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer bg-gray-100 text-gray-700">US</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-black transition-colors" aria-label="Fjern portion">
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-lg text-[#2C3338]">{recipe.servings}</span>
                    <button className="text-gray-600 hover:text-black transition-colors" aria-label="Tilføj portion">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-6">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-[#2C3338]">{item}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
