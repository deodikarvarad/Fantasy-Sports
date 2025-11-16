import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTeamsForMatch } from '../utils/storage'
import { getRoleCounts, normalizeRole } from '../utils/teamValidation'
import TeamHeader from '../components/team/TeamHeader'
import TeamSummary from '../components/team/TeamSummary'
import RoleDistribution from '../components/team/RoleDistribution'
import PlayerCard from '../components/team/PlayerCard'

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
    try {
      const teams = getTeamsForMatch(matchId)
      
      // Try multiple comparison methods to handle different ID types
      let foundTeam = teams.find(t => {
        const tId = t.id
        if (tId === undefined || tId === null) return false
        // Try strict and loose comparisons
        return String(tId) === String(teamId) || tId === teamId || String(tId) === teamId || tId === Number(teamId) || tId == teamId
      })
      
      setTeam(foundTeam || null)
    } catch (error) {
      setTeam(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-300 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-600 mb-4 text-lg">Team not found</p>
          <button
            onClick={() => navigate(`/my-teams/${matchId}`)}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
          >
            Back to My Teams
          </button>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <TeamHeader
        title="Team Details"
        subtitle="View your fantasy team composition"
        onBack={() => navigate(`/my-teams/${matchId}`)}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Team Summary */}
        <div className="mb-6">
          <TeamSummary
            selectedCount={team.players?.length || 0}
            totalCredits={totalCredits}
            creditsLeft={100 - totalCredits}
            isValid={true}
          />
        </div>

        {/* Captain & Vice-Captain */}
        {(captain || viceCaptain) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {captain && (
              <div className="bg-white border-2 border-red-600 rounded-xl p-4 shadow-md">
                <p className="text-red-600 text-sm font-semibold mb-2">Captain (2x Points)</p>
                <p className="text-gray-800 text-lg font-bold mb-1">
                  {captain.Name || captain.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {captain.Role || captain.role} • {captain.team_name || captain.Team || captain.team}
                </p>
              </div>
            )}
            {viceCaptain && (
              <div className="bg-white border-2 border-green-600 rounded-xl p-4 shadow-md">
                <p className="text-green-600 text-sm font-semibold mb-2">Vice-Captain (1.5x Points)</p>
                <p className="text-gray-800 text-lg font-bold mb-1">
                  {viceCaptain.Name || viceCaptain.name}
                </p>
                <p className="text-gray-600 text-sm">
                  {viceCaptain.Role || viceCaptain.role} • {viceCaptain.team_name || viceCaptain.Team || viceCaptain.team}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Role Distribution */}
        <div className="mb-6">
          <RoleDistribution
            roleCounts={roleCounts}
            validation={{ errors: [] }}
          />
        </div>

        {/* Players List by Role */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-gray-800 text-xl font-bold mb-4">Team Players</h2>
          
          <div className="space-y-6">
            {roleOrder.map(role => {
              const rolePlayers = playersByRole[role] || []
              if (rolePlayers.length === 0) return null

              return (
              <div key={role} className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-red-500 pb-2">
                  <h3 className="text-gray-800 text-lg font-bold">
                    {role} <span className="text-gray-500 text-sm font-normal">({rolePlayers.length})</span>
                  </h3>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rolePlayers.map((player, index) => {
                      const playerId = player.id || player.Player_Id || player.player_id || index
                      const isCap = captain && (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)
                      const isVC = viceCaptain && (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)

                      return (
                        <div key={playerId} className="relative">
                          <PlayerCard
                            player={player}
                            isSelected={false}
                            onToggle={() => {}}
                            showActions={false}
                          />
                          {(isCap || isVC) && (
                            <div className="absolute top-[4.5rem] right-auto pl-2 flex space-x-1">
                            {isCap && (
                              <span className="px-3 py-2 bg-red-600 text-white text-xs rounded-full font-bold">
                                C
                              </span>
                            )}
                            {isVC && (
                              <span className="px-3 py-2 bg-green-600 text-white text-xs rounded-full font-bold">
                                VC
                              </span>
                            )}
                            </div>
                          )}
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
        <div className="mt-6 flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
          <button
            onClick={() => navigate(`/my-teams/${matchId}`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 font-semibold transition-colors"
          >
            Back to My Teams
          </button>
          <button
            onClick={() => navigate(`/pick-players/${matchId}`, { state: { editingTeam: team } })}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold transition-colors shadow-md"
          >
            Edit Team
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewTeam