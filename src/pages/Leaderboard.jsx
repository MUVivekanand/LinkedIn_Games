import { useState, useEffect } from 'react'
import { fetchLeaderboard as apiGetLeaderboard } from '../utils/api'
import './Leaderboard.css'

const RANKS = {
  1: { title: '🏆 Pro Player', color: '#FFD700' },
  2: { title: '🥈 Casual Gamer', color: '#C0C0C0' },
  3: { title: '🥉 Noob', color: '#CD7F32' }
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await apiGetLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-wrapper">
        <h2 className="leaderboard-title">🎮 Hall of Fame</h2>
        <p className="leaderboard-subtitle">Who's dominating the LinkedIn Games?</p>

        <div className="podium">
          {leaderboard.map((player, index) => {
            const rank = index + 1
            const rankInfo = RANKS[rank]
            return (
              <div key={player.name} className={`podium-card rank-${rank}`}>
                <div className="rank-badge" style={{ background: rankInfo.color }}>
                  #{rank}
                </div>
                <div className="player-avatar">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="player-name">{player.name}</h3>
                <p className="rank-title">{rankInfo.title}</p>
                <div className="points-display">
                  <span className="points-number">{player.totalPoints}</span>
                  <span className="points-label">points</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
