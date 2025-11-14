import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTeamsForMatch } from '../utils/storage'
import { getRoleCounts, normalizeRole } from '../utils/teamValidation'

function ViewTeam() {
  const { matchId, teamId } = useParams()
  const navigate = useNavigate()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeam()
  }, [matchId, teamId])

  const loadTeam = () => {
    setLoading(true)
    const teams = getTeamsForMatch(matchId)
    const foundTeam = teams.find(t => t.id === teamId)
    setTeam(foundTeam || null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-800 mb-4">Team not found</p>
        <button
          onClick={() => navigate(`/my-teams/${matchId}`)}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Back to My Teams
        </button>
      </div>
    )
  }

  const totalCredits = (team.players || []).reduce((sum, p) => sum + (p.event_player_credit || p.Credits || p.credits || 0), 0)
  const roleCounts = getRoleCounts(team.players || [])
  const captain = team.captain
  const viceCaptain = team.viceCaptain

  // Group players by role for display
  const playersByRole = {}
  ;(team.players || []).forEach(player => {
    const role = normalizeRole(player.Role || player.role) || 'Other'
    if (!playersByRole[role]) {
      playersByRole[role] = []
    }
    playersByRole[role].push(player)
  })

  const roleOrder = ['Wicket Keeper', 'Batsman', 'All Rounder', 'Bowler']

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(`/my-teams/${matchId}`)}
          className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
        >
          ← Back to My Teams
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Team Details</h1>
        <p className="text-gray-600 mt-2">View your fantasy team composition</p>
      </div>

      {/* Team Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Players Selected</p>
            <p className="text-2xl font-bold text-indigo-600">{team.players?.length || 0}/11</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credits Used</p>
            <p className="text-2xl font-bold text-green-600">{totalCredits}/100</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credits Left</p>
            <p className="text-2xl font-bold text-gray-900">{100 - totalCredits}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Team Status</p>
            <p className="text-lg font-bold text-green-600">Complete ✓</p>
          </div>
        </div>

        {/* Captain & Vice-Captain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {captain && (
            <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
              <p className="text-sm font-semibold text-indigo-800 mb-2">Captain (2x Points)</p>
              <p className="text-lg font-bold text-indigo-900">
                {captain.Name || captain.name}
              </p>
              <p className="text-sm text-indigo-700">
                {captain.Role || captain.role} • {captain.team_name || captain.Team || captain.team}
              </p>
            </div>
          )}
          {viceCaptain && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-2">Vice-Captain (1.5x Points)</p>
              <p className="text-lg font-bold text-green-900">
                {viceCaptain.Name || viceCaptain.name}
              </p>
              <p className="text-sm text-green-700">
                {viceCaptain.Role || viceCaptain.role} • {viceCaptain.team_name || viceCaptain.Team || viceCaptain.team}
              </p>
            </div>
          )}
        </div>

        {/* Role Distribution */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Role Distribution:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-green-50">
              <p className="text-xs text-gray-600">Batsman</p>
              <p className="text-lg font-bold">{roleCounts['Batsman']} (3-7)</p>
            </div>
            <div className="p-3 rounded bg-green-50">
              <p className="text-xs text-gray-600">Wicket Keeper</p>
              <p className="text-lg font-bold">{roleCounts['Wicket Keeper']} (1-5)</p>
            </div>
            <div className="p-3 rounded bg-green-50">
              <p className="text-xs text-gray-600">All Rounder</p>
              <p className="text-lg font-bold">{roleCounts['All Rounder']} (0-4)</p>
            </div>
            <div className="p-3 rounded bg-green-50">
              <p className="text-xs text-gray-600">Bowler</p>
              <p className="text-lg font-bold">{roleCounts['Bowler']} (3-7)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Players List by Role */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Players</h2>
        
        <div className="space-y-6">
          {roleOrder.map(role => {
            const rolePlayers = playersByRole[role] || []
            if (rolePlayers.length === 0) return null

            return (
              <div key={role} className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-indigo-200 pb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {role} <span className="text-sm font-normal text-gray-500">({rolePlayers.length})</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rolePlayers.map((player, index) => {
                    const playerId = player.id || player.Player_Id || player.player_id || index
                    const name = player.Name || player.name || 'Unknown'
                    const originalRole = player.Role || player.role || 'N/A'
                    const team = player.team_name || player.Team || player.team || 'N/A'
                    const credits = player.event_player_credit || player.Credits || player.credits || 0
                    const logo = player.team_logo || player.teamLogo || '/default-team-logo.png'
                    const points = player.event_total_points || player.points || 0
                    const isCap = captain && (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)
                    const isVC = viceCaptain && (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)

                    return (
                      <div
                        key={playerId}
                        className={`p-4 border-2 rounded-lg ${
                          isCap
                            ? 'border-indigo-600 bg-indigo-50'
                            : isVC
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{name}</h3>
                            <p className="text-sm text-gray-600">{originalRole}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-indigo-600">{credits}</p>
                            <p className="text-xs text-gray-500">Credits</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1 mb-2">
                          <div className="text-center">
                            <p className='text-xl'>{points}</p>
                            <p className='text-xs text-gray-500'>Total Points</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <img className='h-10' src={logo} alt={team} />
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {team}
                          </span>
                          <div className="flex space-x-1">
                            {isCap && (
                              <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded font-semibold">
                                C
                              </span>
                            )}
                            {isVC && (
                              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-semibold">
                                VC
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/my-teams/${matchId}`)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
        >
          Back to My Teams
        </button>
        <button
          onClick={() => navigate(`/pick-players/${matchId}`, { state: { editingTeam: team } })}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold"
        >
          Edit Team
        </button>
      </div>
    </div>
  )
}

export default ViewTeam
