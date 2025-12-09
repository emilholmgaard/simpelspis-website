'use client'

import { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Button } from '@/components/button'

interface SaveRecipeProps {
  recipeSlug: string
  recipeTitle: string
}

const STORAGE_KEY = 'saved-recipes'

interface SavedRecipe {
  slug: string
  title: string
  savedAt: string
}

export function SaveRecipe({ recipeSlug, recipeTitle }: SaveRecipeProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    // Check if recipe is saved
    const savedRecipes = getSavedRecipes()
    const saved = savedRecipes.some(r => r.slug === recipeSlug)
    setIsSaved(saved)
    setSaveCount(savedRecipes.length)
  }, [recipeSlug])

  const getSavedRecipes = (): SavedRecipe[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveRecipe = () => {
    const savedRecipes = getSavedRecipes()
    
    if (isSaved) {
      // Remove from saved
      const updated = savedRecipes.filter(r => r.slug !== recipeSlug)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setIsSaved(false)
      setSaveCount(updated.length)
    } else {
      // Add to saved
      const newRecipe: SavedRecipe = {
        slug: recipeSlug,
        title: recipeTitle,
        savedAt: new Date().toISOString(),
      }
      const updated = [...savedRecipes, newRecipe]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setIsSaved(true)
      setSaveCount(updated.length)
    }
  }

  return (
    <Button
      variant={isSaved ? 'primary' : 'outline'}
      onClick={saveRecipe}
      className="relative"
    >
      {isSaved ? (
        <HeartIconSolid className="mr-2 h-5 w-5" />
      ) : (
        <HeartIcon className="mr-2 h-5 w-5" />
      )}
      {isSaved ? 'Gemt' : 'Gem opskrift'}
    </Button>
  )
}

// Export function to get all saved recipes (for a "Mine opskrifter" page)
export function getAllSavedRecipes(): SavedRecipe[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
