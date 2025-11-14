import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTeamsForMatch, deleteTeam } from '../utils/storage'
import { getRoleCounts } from '../utils/teamValidation'

function MyTeams() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()
  }, [matchId])

  const loadTeams = () => {
    setLoading(true)
    const savedTeams = getTeamsForMatch(matchId)
    setTeams(savedTeams)
    setLoading(false)
  }

  const handleViewTeam = (team) => {
    navigate(`/view-team/${matchId}/${team.id}`)
  }

  const handleEditTeam = (team) => {
    navigate(`/pick-players/${matchId}`, { state: { editingTeam: team } })
  }

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(matchId, teamId)
      loadTeams()
    }
  }

  const handleCreateNew = () => {
    navigate(`/pick-players/${matchId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/matches')}
            className="text-red-600 hover:text-red-800 mb-4 flex items-center"
          >
            ← Back to Matches
          </button>
          <h1 className="text-3xl font-bold text-gray-800">My Teams</h1>
          <p className="text-gray-600 mt-2">Manage your fantasy teams for this match</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold shadow-md"
        >
          + Create New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">You haven't created any teams yet</p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold shadow-md"
          >
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => {
            const totalCredits = (team.players || []).reduce((sum, p) => sum + (p.event_player_credit || p.Credits || p.credits || 0), 0)
            const roleCounts = getRoleCounts(team.players || [])
            const captain = team.captain
            const viceCaptain = team.viceCaptain

            return (
              <div
                key={team.id || index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Team {index + 1}</h3>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      {team.players?.length || 0}/11 Players
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Credits</p>
                      <p className="text-lg font-semibold text-gray-800">{totalCredits}/100</p>
                    </div>

                    {captain && (
                      <div className="p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-xs text-gray-600">Captain</p>
                        <p className="text-sm font-semibold text-red-900">
                          {captain.Name || captain.name}
                        </p>
                      </div>
                    )}

                    {viceCaptain && (
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-600">Vice-Captain</p>
                        <p className="text-sm font-semibold text-green-900">
                          {viceCaptain.Name || viceCaptain.name}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Role Distribution:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Batsman: {roleCounts['Batsman']}</div>
                        <div>WK: {roleCounts['Wicket Keeper']}</div>
                        <div>AR: {roleCounts['All Rounder']}</div>
                        <div>Bowler: {roleCounts['Bowler']}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={() => handleViewTeam(team)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold text-sm shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-semibold text-sm"
                    >
                      Delete
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

export default MyTeams
