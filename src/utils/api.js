// Mock data for local development
let mockRows = []

const isProduction = import.meta.env.PROD
const API_URL = isProduction ? '/api' : ''

// Local storage key
const STORAGE_KEY = 'linkedin_leaderboard_rows'

// Load from localStorage on init
if (!isProduction && typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      mockRows = JSON.parse(stored)
      // Clean up duplicates on load
      mockRows = removeDuplicates(mockRows)
      saveToLocalStorage()
    } catch (e) {
      mockRows = []
    }
  }
}

function removeDuplicates(rows) {
  const seen = new Map()
  const uniqueRows = []
  
  // Keep only the first occurrence of each date+game combination
  for (const row of rows) {
    const key = `${row.date}-${row.game}`
    if (!seen.has(key)) {
      seen.set(key, true)
      uniqueRows.push(row)
    }
  }
  
  return uniqueRows
}

function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRows))
  }
}

export async function cleanupDuplicates() {
  if (isProduction) {
    const response = await fetch(`${API_URL}/cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } else {
    // Local development - clean duplicates
    const originalCount = mockRows.length
    mockRows = removeDuplicates(mockRows)
    saveToLocalStorage()
    const deletedCount = originalCount - mockRows.length
    return { 
      success: true, 
      deletedCount,
      message: `Removed ${deletedCount} duplicate entries. Refresh to see changes.`
    }
  }
}

export async function fetchRows() {
  if (isProduction) {
    const response = await fetch(`${API_URL}/rows`)
    return await response.json()
  } else {
    // Local development - use mock data
    return mockRows
  }
}

export async function saveRow(row) {
  if (isProduction) {
    const response = await fetch(`${API_URL}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || errorData.error || 'Failed to save')
    }
    
    return await response.json()
  } else {
    // Local development - save to mock data
    // Check for duplicate date+game combination
    const duplicateIndex = mockRows.findIndex(
      r => r.date === row.date && r.game === row.game && r.id !== row.id
    )
    
    if (duplicateIndex >= 0) {
      // Remove duplicate
      mockRows.splice(duplicateIndex, 1)
    }
    
    const index = mockRows.findIndex(r => r.id === row.id)
    if (index >= 0) {
      mockRows[index] = row
    } else {
      mockRows.push(row)
    }
    saveToLocalStorage()
    return { success: true }
  }
}

export async function fetchLeaderboard() {
  if (isProduction) {
    const response = await fetch(`${API_URL}/leaderboard`)
    return await response.json()
  } else {
    // Local development - calculate from mock data
    const totals = {
      kirukku: 0,
      srinathi: 0,
      vivaaek: 0
    }

    mockRows.forEach(row => {
      totals.kirukku += row.kirukku || 0
      totals.srinathi += row.srinathi || 0
      totals.vivaaek += row.vivaaek || 0
    })

    const leaderboard = [
      { name: 'kirukku', totalPoints: totals.kirukku },
      { name: 'srinathi', totalPoints: totals.srinathi },
      { name: 'vivaaek', totalPoints: totals.vivaaek }
    ].sort((a, b) => b.totalPoints - a.totalPoints)

    return leaderboard
  }
}
