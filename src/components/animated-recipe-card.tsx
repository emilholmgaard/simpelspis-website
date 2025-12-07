'use client'

import { Link } from '@/components/link'
import { ChevronRightIcon, HeartIcon } from '@heroicons/react/24/solid'
import type { RecipeListItem } from '@/lib/recipes'
import { useEffect, useRef, useState } from 'react'

interface AnimatedRecipeCardProps extends RecipeListItem {
  index: number
}

interface RecipeData {
  ingredients?: string[]
  nutrition?: {
    energy: string
    protein: string
    carbs: string
    fat: string
  }
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
}

export function AnimatedRecipeCard({
  slug,
  title,
  category,
  time,
  prepTime,
  cookTime,
  difficulty,
  excerpt,
  index,
}: AnimatedRecipeCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null)
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const fetchData = async () => {
      try {
        const [recipeRes, statsRes] = await Promise.all([
          fetch(`/api/recipes/${slug}`).catch(() => null),
          fetch(`/api/reviews/stats?recipeSlug=${slug}`).catch(() => null),
        ])

        if (recipeRes?.ok) {
          const recipe = await recipeRes.json()
          setRecipeData({
            ingredients: recipe.ingredients,
            nutrition: recipe.nutrition,
          })
        }

        if (statsRes?.ok) {
          const stats = await statsRes.json()
          if (stats.totalReviews > 0) {
            setReviewStats({
              averageRating: stats.averageRating,
              totalReviews: stats.totalReviews,
            })
          }
        }
        } catch (error) {
        console.error('Error fetching recipe data:', error)
      }
    }

    fetchData()
  }, [slug, isVisible])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Link
        href={`/opskrifter/${slug}`}
        className="group relative flex w-full flex-col gap-y-6 overflow-hidden rounded-3xl bg-gray-200 p-2 dark:bg-gray-900 xl:flex-row transition-all duration-300 data-hover:shadow-lg"
      >
        {/* Content Section */}
        <div className="flex w-full flex-1 flex-col gap-y-8 p-6 md:p-12">
          <div className="flex flex-wrap items-center gap-3 text-sm/5 text-gray-600 dark:text-gray-400">
            <span className="font-medium">{category}</span>
            {reviewStats && reviewStats.totalReviews > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <HeartIcon className="size-4 text-red-500" />
                  <span className="font-medium text-gray-950 dark:text-gray-50">
                    {reviewStats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'anmeldelse' : 'anmeldelser'})
                  </span>
                </div>
              </>
            )}
            <span>•</span>
            <span>{difficulty}</span>
          </div>
          <h3 className="text-3xl leading-tight text-balance md:text-4xl font-medium text-gray-950 dark:text-gray-50">
            {title}
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400">{excerpt}</p>
          <div className="flex items-center gap-1 text-sm/5 font-medium text-gray-950 dark:text-gray-50">
            Se opskrift
            <ChevronRightIcon className="size-4 transition-transform group-data-hover:translate-x-1" />
          </div>
        </div>
        
        {/* Info Section */}
        <div className="flex w-full flex-1 flex-col gap-y-4 rounded-3xl bg-gray-50 p-8 dark:bg-gray-800">
          {/* Time Info */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-950 dark:text-gray-50 mb-3">Tidsinformation</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">I alt:</span>
                <span>{time}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Forberedelse:</span>
                <span>{prepTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Tilberedning:</span>
                <span>{cookTime}</span>
              </div>
            </div>
          </div>

          {/* Ingredients Count */}
          {recipeData?.ingredients && (
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-950 dark:text-gray-50">Ingredienser</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipeData.ingredients.length} {recipeData.ingredients.length === 1 ? 'ingrediens' : 'ingredienser'}
                </span>
              </div>
            </div>
          )}

          {/* Nutrition */}
          {recipeData?.nutrition && (
            <div>
              <h4 className="text-sm font-medium text-gray-950 dark:text-gray-50 mb-3">Næringsværdi</h4>
              <div className="space-y-2">
                {recipeData.nutrition.energy && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Kalorier:</span>
                    <span>{recipeData.nutrition.energy}</span>
                  </div>
                )}
                {recipeData.nutrition.protein && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Protein:</span>
                    <span>{recipeData.nutrition.protein}</span>
                  </div>
                )}
                {recipeData.nutrition.carbs && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Kulhydrater:</span>
                    <span>{recipeData.nutrition.carbs}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
