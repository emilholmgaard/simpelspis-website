'use client'

import { PrinterIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Button } from './button'
import type { Recipe } from '@/lib/recipes'

interface RecipeActionsProps {
  recipe: Recipe
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: recipe.title,
      text: `Tjek denne opskrift: ${recipe.title}`,
      url: url,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: Kopier URL til clipboard
        await navigator.clipboard.writeText(url)
        alert('Link kopieret til udklipsholder!')
      }
    } catch (error) {
      // Brugeren annullerede deling eller der opstod en fejl
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback: Kopier URL til clipboard
        navigator.clipboard.writeText(url).then(() => {
          alert('Link kopieret til udklipsholder!')
        })
      }
    }
  }

  const handleDownload = () => {
    // Filtrer ingredienser (fjern sektion headers)
    const formattedIngredients = recipe.ingredients
      .filter(ing => ing && ing.trim() && !ing.endsWith(':'))
      .map(ing => ing.trim())

    // Filtrer instruktioner (fjern sektion headers)
    const formattedInstructions = recipe.instructions
      .filter(inst => inst && inst.trim() && !inst.match(/^(FORBEREDELSE|TILBEREDNING|SAMMENSAETNING|PRO TIPS)/i))
      .map(inst => inst.trim())

    // Opret tekst version af opskriften
    let textContent = `${recipe.title}\n`
    textContent += `${'='.repeat(recipe.title.length)}\n\n`
    
    textContent += `Beskrivelse:\n${recipe.description}\n\n`
    
    textContent += `Information:\n`
    textContent += `• Kategori: ${recipe.category}\n`
    textContent += `• Sværhedsgrad: ${recipe.difficulty}\n`
    textContent += `• Total tid: ${recipe.time}\n`
    textContent += `• Forberedelse: ${recipe.prepTime}\n`
    textContent += `• Tilberedning: ${recipe.cookTime}\n\n`
    
    textContent += `Næringsindhold per portion:\n`
    textContent += `• Energi: ${recipe.nutrition.energy}\n`
    textContent += `• Fedt: ${recipe.nutrition.fat}\n`
    textContent += `• Heraf mættet: ${recipe.nutrition.saturatedFat}\n`
    textContent += `• Kulhydrat: ${recipe.nutrition.carbs}\n`
    textContent += `• Heraf sukker: ${recipe.nutrition.sugar}\n`
    textContent += `• Fiber: ${recipe.nutrition.fiber}\n`
    textContent += `• Protein: ${recipe.nutrition.protein}\n`
    textContent += `• Salt: ${recipe.nutrition.salt}\n\n`
    
    textContent += `Ingredienser:\n`
    formattedIngredients.forEach((ingredient, index) => {
      textContent += `${index + 1}. ${ingredient}\n`
    })
    
    textContent += `\nFremgangsmåde:\n`
    formattedInstructions.forEach((instruction, index) => {
      textContent += `${index + 1}. ${instruction}\n`
    })
    
    textContent += `\n\n---\n`
    textContent += `Downloadet fra Simpel Spis\n`
    textContent += `www.simpelspis.dk/opskrifter/${recipe.slug}\n`

    // Opret blob og download
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${recipe.slug}-opskrift.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="no-print mt-6 mb-6 flex flex-wrap gap-4">
      <Button variant="primary" onClick={handleDownload}>
        <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
        Download opskrift
      </Button>
      <Button variant="secondary" onClick={handleShare}>
        <ShareIcon className="mr-2 h-5 w-5" />
        Del opskrift
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <PrinterIcon className="mr-2 h-5 w-5" />
        Print opskrift
      </Button>
    </div>
  )
}

