import { useState, useEffect } from 'react'
import { fetchRows as apiGetRows, saveRow as apiSaveRow, cleanupDuplicates } from '../utils/api'
import './Home.css'

const GAMES = ['Zip', 'Queens', 'Sudoku', 'Pinpoint', 'Patches', 'Tango', 'Crossclimb', 'Hard Word']

function Home() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRows()
  }, [])

  const loadRows = async () => {
    try {
      const data = await apiGetRows()
      setRows(data)
    } catch (error) {
      console.error('Error fetching rows:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = async () => {
    try {
      const result = await cleanupDuplicates()
      alert(result.message)
      loadRows() // Reload data after cleanup
    } catch (error) {
      console.error('Error cleaning up:', error)
      alert('Cleanup failed')
    }
  }

  const addRowsForToday = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    
    // Check if rows for today already exist
    const existingGamesForToday = rows.filter(row => row.date === today).map(row => row.game)
    
    // Only add games that don't exist for today
    const newRows = GAMES
      .filter(game => !existingGamesForToday.includes(game))
      .map(game => ({
        id: `${today}-${game}`,
        date: today,
        game,
        kirukku: 0,
        srinathi: 0,
        vivaaek: 0,
        isEditing: false
      }))
    
    if (newRows.length === 0) {
      alert('All games for today have already been added!')
      return
    }
    
    setRows([...newRows, ...rows])
  }

  const updatePoints = async (id, player, value) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, [player]: parseInt(value) || 0 } : row
    )
    setRows(updatedRows)
  }

  const saveRow = async (id) => {
    const row = rows.find(r => r.id === id)
    try {
      await apiSaveRow(row)
      const updatedRows = rows.map(r =>
        r.id === id ? { ...r, isEditing: false } : r
      )
      setRows(updatedRows)
    } catch (error) {
      console.error('Error saving row:', error)
    }
  }

  const toggleEdit = (id) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, isEditing: !row.isEditing } : row
    )
    setRows(updatedRows)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h2 className="page-title">Daily Game Scores</h2>
          <div className="header-buttons">
            <button className="cleanup-btn" onClick={handleCleanup}>
              🧹 Clean Duplicates
            </button>
            <button className="add-btn" onClick={addRowsForToday}>
              ➕ Add Today's Games
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scores-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Game</th>
                <th>Kirukku</th>
                <th>Srinathi</th>
                <th>Vivaaek</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className={row.isEditing ? 'editing' : ''}>
                  <td>{row.date}</td>
                  <td className="game-cell">{row.game}</td>
                  <td>
                    {row.isEditing ? (
                      <input
                        type="number"
                        value={row.kirukku}
                        onChange={(e) => updatePoints(row.id, 'kirukku', e.target.value)}
                        className="score-input"
                      />
                    ) : (
                      <span className="score">{row.kirukku}</span>
                    )}
                  </td>
                  <td>
                    {row.isEditing ? (
                      <input
                        type="number"
                        value={row.srinathi}
                        onChange={(e) => updatePoints(row.id, 'srinathi', e.target.value)}
                        className="score-input"
                      />
                    ) : (
                      <span className="score">{row.srinathi}</span>
                    )}
                  </td>
                  <td>
                    {row.isEditing ? (
                      <input
                        type="number"
                        value={row.vivaaek}
                        onChange={(e) => updatePoints(row.id, 'vivaaek', e.target.value)}
                        className="score-input"
                      />
                    ) : (
                      <span className="score">{row.vivaaek}</span>
                    )}
                  </td>
                  <td>
                    {row.isEditing ? (
                      <button className="save-btn" onClick={() => saveRow(row.id)}>
                        💾 Save
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={() => toggleEdit(row.id)}>
                        ✏️ Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home
