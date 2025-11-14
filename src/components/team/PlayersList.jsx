import { normalizeRole } from '../../utils/teamValidation'
import PlayerCard from './PlayerCard'

function PlayersList({ players, selectedPlayers, onTogglePlayer, isPlayerSelected, captain, viceCaptain }) {
  // Sort and group players by role
  const getSortedPlayersByRole = () => {
    const roleOrder = ['Wicket Keeper', 'Batsman', 'All Rounder', 'Bowler']
    const grouped = {}
    
    players.forEach(player => {
      const normalizedRole = normalizeRole(player.Role || player.role) || 'Other'
      if (!grouped[normalizedRole]) {
        grouped[normalizedRole] = []
      }
      grouped[normalizedRole].push(player)
    })
    
    // Sort players within each role by name
    Object.keys(grouped).forEach(role => {
      grouped[role].sort((a, b) => {
        const nameA = (a.Name || a.name || '').toLowerCase()
        const nameB = (b.Name || b.name || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
    })
    
    return { grouped, roleOrder }
  }

  const { grouped, roleOrder } = getSortedPlayersByRole()
  const allRoles = [...roleOrder, ...Object.keys(grouped).filter(r => !roleOrder.includes(r))]

  return (
    <div className="space-y-6">
      {allRoles.map(role => {
        const rolePlayers = grouped[role] || []
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
                const selected = isPlayerSelected(player)
                const isCap = captain && (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)
                const isVC = viceCaptain && (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)

                return (
                  <div key={playerId} className="relative">
                    <PlayerCard
                      player={player}
                      isSelected={selected}
                      onToggle={() => onTogglePlayer(player)}
                      showActions={true}
                    />
                    {(isCap || isVC) && (
                      <div className="absolute top-20 right-48 flex space-x-1">
                        {isCap && (
                          <span className="px-3 py-2 bg-[#e41b23] text-white text-xs rounded-full font-bold">
                            C
                          </span>
                        )}
                        {isVC && (
                          <span className="px-3 py-2 bg-[#2dd45c] text-white text-xs rounded-full font-bold">
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
  )
}

export default PlayersList
