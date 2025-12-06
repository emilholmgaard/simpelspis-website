'use client'

import { PrinterIcon, ShareIcon } from '@heroicons/react/24/outline'
import { Button } from './button'

interface RecipeActionsProps {
  title: string
  slug: string
}

export function RecipeActions({ title }: RecipeActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: title,
      text: `Tjek denne opskrift: ${title}`,
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

  return (
    <div className="no-print mt-16 flex flex-wrap gap-4">
      <Button href="/opskrifter">Se flere opskrifter</Button>
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

