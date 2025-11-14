import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUpcomingMatches } from '../services/api'

function UpcomingMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchUpcomingMatches()
      // Handle nested structure: matches.cricket or matches.Cricket
      let matchesList = []
      if (data.matches) {
        matchesList = data.matches.cricket || data.matches.Cricket || []
        // If cricket is not found, try to get first array value
        if (!Array.isArray(matchesList) && typeof data.matches === 'object') {
          const keys = Object.keys(data.matches)
          if (keys.length > 0) {
            matchesList = data.matches[keys[0]] || []
          }
        }
      } else if (data.Matches) {
        matchesList = data.Matches.cricket || data.Matches.Cricket || []
      } else if (Array.isArray(data)) {
        matchesList = data
      }
      setMatches(Array.isArray(matchesList) ? matchesList : [])
    } catch (err) {
      setError('Failed to load matches. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMatchClick = (match) => {
    const matchId = match.id || match.Match_Id || match.match_id || match.MatchId
    navigate(`/pick-players/${matchId}`)
  }

  const handleViewTeams = (match) => {
    const matchId = match.id || match.Match_Id || match.match_id || match.MatchId
    navigate(`/my-teams/${matchId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadMatches}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Upcoming Matches</h1>
        <p className="text-gray-600">Select a match to create your fantasy team</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No upcoming matches available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => {
            const matchId = match.id || match.Match_Id || match.match_id || match.MatchId
            const team1 = match.t1_name || match.Team1 || match.team1 || match.Team_A || 'Team A'
            const team1logo = match.t1_image || match.Team1_Logo || match.team1_logo || match.Team_A_Logo || '/default-team-logo.png'
            const team2logo = match.t2_image || match.Team2_Logo || match.team2_logo || match.Team_B_Logo || '/default-team-logo.png'
            const team2 = match.t2_name || match.Team2 || match.team2 || match.Team_B || 'Team B'
            const team1Short = match.t1_short_name || match.Team1_Short || ''
            const team2Short = match.t2_short_name || match.Team2_Short || ''
            const matchName = match.match_name || match.Match_Name || ''
            const eventName = match.event_name || match.Event_Name || ''
            
            // Parse date
            let date = 'TBD'
            let time = 'TBD'
            if (match.match_date) {
              try {
                const matchDate = new Date(match.match_date)
                date = matchDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
                time = matchDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })
              } catch (e) {
                date = match.match_date
              }
            } else {
              date = match.Date || match.date || match.Match_Date || 'TBD'
              time = match.Time || match.time || match.Match_Time || 'TBD'
            }
            
            const venue = match.Venue || match.venue || eventName || 'TBD'

            return (
              <div
                key={matchId || index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      {eventName || venue}
                    </span>
                    <span className="text-sm text-gray-500">{date}</span>
                  </div>
                  
                  <div className="text-center mb-4">
                    {matchName && (
                      <p className="text-xs text-gray-500 mb-2">{matchName}</p>
                    )}
                    <div className="flex items-center justify-center space-x-4 mb-2">
                      <div className="text-center">
                        <div className="">
                          <img src={team1logo} alt="" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">{team1}</div>
                        {team1Short && (
                          <div className="text-xs text-gray-500">{team1Short}</div>
                        )}
                      </div>
                      <div className="text-gray-400 font-bold">VS</div>
                      <div className="text-center">
                        <div className="">
                          <img src={team2logo} alt="" />
                        </div>
                        <div className="text-lg font-bold text-gray-800">{team2}</div>
                        {team2Short && (
                          <div className="text-xs text-gray-500">{team2Short}</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{time}</p>
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={() => handleMatchClick(match)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold shadow-md"
                    >
                      Create Team
                    </button>
                    <button
                      onClick={() => handleViewTeams(match)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors font-semibold"
                    >
                      My Teams
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UpcomingMatches
