import fs from 'fs'
import path from 'path'

export interface Recipe {
  slug: string
  id: string
  title: string
  type?: string
  category: string
  time: string
  prepTime: string
  cookTime: string
  difficulty: string
  excerpt: string
  description: string
  ingredients: string[]
  instructions: string[]
  budget?: boolean
  datePublished?: string // ISO 8601 format (e.g., "2025-01-15T10:00:00+01:00")
  dateModified?: string // ISO 8601 format
  nutrition: {
    energy: string
    fat: string
    saturatedFat: string
    carbs: string
    sugar: string
    fiber: string
    protein: string
    salt: string
  }
}

export interface RecipeListItem {
  slug: string
  title: string
  type?: string
  category: string
  time: string
  prepTime: string
  cookTime: string
  difficulty: string
  excerpt: string
}

const recipesDirectory = path.join(process.cwd(), 'src/data/recipes')

/**
 * Henter alle opskrifter (kun metadata for liste)
 */
export function getAllRecipes(): RecipeListItem[] {
  const filePath = path.join(recipesDirectory, 'index.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

/**
 * Henter en specifik opskrift med alt data
 */
export function getRecipeBySlug(slug: string): Recipe | null {
  try {
    const filePath = path.join(recipesDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    return null
  }
}

/**
 * Henter alle opskrifter med fuldt data (for sitemap osv.)
 */
export function getAllRecipesWithData(): Recipe[] {
  const recipes = getAllRecipes()
  return recipes
    .map((recipe) => getRecipeBySlug(recipe.slug))
    .filter((recipe): recipe is Recipe => recipe !== null)
}

