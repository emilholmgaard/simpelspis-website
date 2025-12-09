'use client'

import { useState, useEffect, useMemo } from 'react'
import { PortionAdjuster } from './portion-adjuster'

interface RecipeIngredientsProps {
  ingredients: string[]
  defaultPortions?: number
}

// Parse ingrediens og ekstraher mængde
function parseIngredient(ingredient: string): { amount: string | null; unit: string | null; rest: string } {
  // Match mønstre som "6 store æg", "2 spsk tomatpuré", "1/2 tsk salt", "400g bønner", "1 håndfuld"
  const patterns = [
    /^(\d+\/\d+)\s+([a-zæøå]+)\s+(.+)$/i, // 1/2 tsk salt
    /^(\d+\.\d+)\s+([a-zæøå]+)\s+(.+)$/i, // 1.5 dl mælk
    /^(\d+)\s+([a-zæøå]+)\s+(.+)$/i, // 2 spsk tomatpuré eller 1 håndfuld koriander
    /^(\d+)\s+(.+)$/i, // 6 store æg
  ]

  for (const pattern of patterns) {
    const match = ingredient.match(pattern)
    if (match) {
      const amount = match[1]
      const unit = match[2] || null
      const rest = match[3] || ''
      
      // Hvis unit er faktisk en del af ingrediensen (f.eks. "store æg"), ikke en enhed
      // Tjek om unit er en kendt enhed
      const knownUnits = ['g', 'kg', 'dl', 'l', 'ml', 'tsk', 'spsk', 'stk', 'stykker', 'fed', 'håndfuld', 'håndfulde']
      const isUnit = unit && knownUnits.some(u => unit.toLowerCase().includes(u.toLowerCase()))
      
      if (isUnit && rest) {
        return { amount, unit, rest }
      } else if (rest) {
        // Unit er faktisk en del af ingrediensen
        return { amount, unit: null, rest: `${unit} ${rest}`.trim() }
      } else {
        // Ingen rest, unit er måske en del af ingrediensen
        return { amount, unit: null, rest: unit || '' }
      }
    }
  }

  // Hvis ingen match, returner hele ingrediensen som rest
  return { amount: null, unit: null, rest: ingredient }
}

// Juster mængde baseret på portionsfaktor
function adjustAmount(amount: string | null, factor: number): string | null {
  if (!amount) return null

  // Håndter brøker (1/2, 1/4, etc.)
  if (amount.includes('/')) {
    const [numerator, denominator] = amount.split('/').map(Number)
    const decimal = numerator / denominator
    const adjusted = decimal * factor
    
    // Prøv at finde en pæn brøk
    if (adjusted < 1) {
      // Find tætteste brøk
      const fractions = [
        { val: 1/4, str: '1/4' },
        { val: 1/3, str: '1/3' },
        { val: 1/2, str: '1/2' },
        { val: 2/3, str: '2/3' },
        { val: 3/4, str: '3/4' },
      ]
      const closest = fractions.reduce((prev, curr) => 
        Math.abs(curr.val - adjusted) < Math.abs(prev.val - adjusted) ? curr : prev
      )
      if (Math.abs(closest.val - adjusted) < 0.1) {
        return closest.str
      }
    }
    
    // Rund til 1 decimal
    return Math.round(adjusted * 10) / 10 === Math.round(adjusted) 
      ? Math.round(adjusted).toString()
      : (Math.round(adjusted * 10) / 10).toString()
  }

  // Håndter decimaler
  const num = parseFloat(amount)
  if (isNaN(num)) return amount

  const adjusted = num * factor
  
  // Rund til 1 decimal hvis nødvendigt
  if (adjusted % 1 === 0) {
    return Math.round(adjusted).toString()
  }
  
  return (Math.round(adjusted * 10) / 10).toString()
}

// Formater ingrediens med justeret mængde
function formatAdjustedIngredient(original: string, factor: number): string {
  if (factor === 1) return original

  const { amount, unit, rest } = parseIngredient(original)
  const adjustedAmount = adjustAmount(amount, factor)

  if (!adjustedAmount) return original

  if (unit) {
    return `${adjustedAmount} ${unit} ${rest}`.trim()
  }

  return `${adjustedAmount} ${rest}`.trim()
}

export function RecipeIngredients({ ingredients, defaultPortions = 4 }: RecipeIngredientsProps) {
  const [portions, setPortions] = useState(defaultPortions)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const factor = portions / defaultPortions

  const adjustedIngredients = useMemo(() => {
    return ingredients.map(ing => formatAdjustedIngredient(ing, factor))
  }, [ingredients, factor])

  const toggleChecked = (index: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Reset checkboxes når portioner ændres
  useEffect(() => {
    setCheckedItems(new Set())
  }, [portions])

  return (
    <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50">Ingredienser</h2>
        <PortionAdjuster defaultPortions={defaultPortions} onPortionsChange={setPortions} />
      </div>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const isSectionHeader = ingredient.endsWith(':')
          const isEmpty = ingredient.trim() === ''
          const isChecked = checkedItems.has(index)

          if (isEmpty) {
            return <li key={index} className="h-2" />
          }

          if (isSectionHeader) {
            return (
              <li key={index} className="mt-4 first:mt-0">
                <span className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                  {ingredient}
                </span>
              </li>
            )
          }

          return (
            <li
              key={index}
              className="flex items-start gap-3 text-sm/6 text-gray-600 dark:text-gray-400"
            >
              <input
                type="checkbox"
                id={`ingredient-${index}`}
                checked={isChecked}
                onChange={() => toggleChecked(index)}
                className="mt-1.5 h-4 w-4 shrink-0 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:checked:bg-blue-600 cursor-pointer"
              />
              <label
                htmlFor={`ingredient-${index}`}
                className={`flex-1 cursor-pointer select-none ${
                  isChecked
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {adjustedIngredients[index]}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
