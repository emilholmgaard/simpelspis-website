'use client'

import { Link } from '@/components/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import type { RecipeListItem } from '@/lib/recipes'

export function RecipeCard({
  slug,
  title,
  category,
  time,
  prepTime,
  cookTime,
  difficulty,
  excerpt,
}: RecipeListItem) {
  return (
    <Link
      href={`/opskrifter/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-shadow data-hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-sm/5 text-gray-600 dark:text-gray-400">
          <span className="font-medium">{category}</span>
          <span>•</span>
          <span>{difficulty}</span>
        </div>
        <h3 className="mt-3 text-xl/7 font-medium text-gray-950 dark:text-gray-50">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm/6 text-gray-500 dark:text-gray-400">{excerpt}</p>
        <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">I alt:</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Forberedelse:</span>
            <span>{prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Tilberedning:</span>
            <span>{cookTime}</span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm/5 font-medium text-gray-950 dark:text-gray-50">
          Se opskrift
          <ChevronRightIcon className="size-4 transition-transform group-data-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

