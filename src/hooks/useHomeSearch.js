import { useState, useMemo } from 'react'
import { parks } from '../data/parks'
import { trails } from '../data/trails'
import { waterfalls } from '../data/waterfalls'

/**
 * useHomeSearch
 * Busca global que cobre parques, trilhas e cachoeiras.
 * Retorna resultados categorizados e paginados.
 */
export function useHomeSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (term.length < 2) return null

    const matchedParks = parks.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term) ||
      p.biodiversity.some(b => b.toLowerCase().includes(term))
    ).map(p => ({ ...p, resultType: 'park' }))

    const matchedTrails = trails.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.parkName.toLowerCase().includes(term) ||
      t.difficultyLabel.toLowerCase().includes(term)
    ).map(t => ({ ...t, resultType: 'trail' }))

    const matchedWaterfalls = waterfalls.filter(w =>
      w.name.toLowerCase().includes(term) ||
      w.parkName.toLowerCase().includes(term)
    ).map(w => ({ ...w, resultType: 'waterfall' }))

    return {
      parks:      matchedParks,
      trails:     matchedTrails,
      waterfalls: matchedWaterfalls,
      total:      matchedParks.length + matchedTrails.length + matchedWaterfalls.length,
    }
  }, [query])

  function clearSearch() { setQuery('') }

  return { query, setQuery, clearSearch, results }
}
