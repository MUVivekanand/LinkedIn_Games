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
    } catch (e) {
      mockRows = []
    }
  }
}

function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRows))
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
    return await response.json()
  } else {
    // Local development - save to mock data
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
