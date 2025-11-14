import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { fetchPlayers } from '../services/api'
import { validateTeam, getRoleCounts, normalizeRole } from '../utils/teamValidation'

const ROLES = ['All', 'Batsman', 'Wicket Keeper', 'All Rounder', 'Bowler']
const CREDIT_RANGES = [
  { label: 'All', min: 0, max: 100 },
  { label: '0-5', min: 0, max: 5 },
  { label: '6-8', min: 6, max: 8 },
  { label: '9-10', min: 9, max: 10 },
  { label: '10+', min: 10, max: 100 },
]

function PickPlayers() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [players, setPlayers] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTeamId, setEditingTeamId] = useState(null)
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('All')
  const [teamFilter, setTeamFilter] = useState('All')
  const [creditFilter, setCreditFilter] = useState({ min: 0, max: 100 })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPlayers()
    // Handle editing existing team
    if (location.state?.editingTeam) {
      const team = location.state.editingTeam
      setSelectedPlayers(team.players || [])
      setEditingTeamId(team.id)
    }
  }, [location.state])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPlayers()
      // Handle different possible response structures
      let playersList = []
      if (data.players) {
        // Check if players is an array or nested object
        if (Array.isArray(data.players)) {
          playersList = data.players
        } else if (typeof data.players === 'object') {
          // Try to get first array value from nested structure
          const keys = Object.keys(data.players)
          if (keys.length > 0) {
            playersList = data.players[keys[0]] || []
          }
        }
      } else if (data.Players) {
        if (Array.isArray(data.Players)) {
          playersList = data.Players
        } else if (typeof data.Players === 'object') {
          const keys = Object.keys(data.Players)
          if (keys.length > 0) {
            playersList = data.Players[keys[0]] || []
          }
        }
      } else if (Array.isArray(data)) {
        playersList = data
      }
      setPlayers(Array.isArray(playersList) ? playersList : [])
    } catch (err) {
      setError('Failed to load players. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreditFilterChange = (range) => {
    if (range === 'All') {
      setCreditFilter({ min: 0, max: 100 })
    } else {
      const selected = CREDIT_RANGES.find(r => r.label === range)
      setCreditFilter({ min: selected.min, max: selected.max })
    }
  }

  const togglePlayer = (player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => 
        (p.id || p.Player_Id || p.player_id) === (player.id || player.Player_Id || player.player_id)
      )
      
      if (isSelected) {
        return prev.filter(p => 
          (p.id || p.Player_Id || p.player_id) !== (player.id || player.Player_Id || player.player_id)
        )
      } else {
        if (prev.length >= 11) {
          alert('You can only select 11 players')
          return prev
        }
        return [...prev, player]
      }
    })
  }

  const isPlayerSelected = (player) => {
    return selectedPlayers.some(p => 
      (p.id || p.Player_Id || p.player_id) === (player.id || player.Player_Id || player.player_id)
    )
  }

  const getFilteredPlayers = () => {
    return players.filter(player => {
      const role = normalizeRole(player.Role || player.role) || (player.Role || player.role || '')
      const team = player.Team || player.team || ''
      const credits = player.Credits || player.credits || 0
      const name = (player.Name || player.name || '').toLowerCase()
      
      // Use normalized role for filtering
      if (roleFilter !== 'All' && role !== roleFilter) return false
      if (teamFilter !== 'All' && team !== teamFilter) return false
      if (credits < creditFilter.min || credits > creditFilter.max) return false
      if (searchQuery && !name.includes(searchQuery.toLowerCase())) return false
      
      return true
    })
  }

  // Sort and group players by role
  const getSortedPlayersByRole = () => {
    const filtered = getFilteredPlayers()
    
    // Define role order
    const roleOrder = ['Wicket Keeper', 'Batsman', 'All Rounder', 'Bowler']
    
    // Group players by normalized role
    const grouped = {}
    filtered.forEach(player => {
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
    
    // Return grouped structure
    return { grouped, roleOrder }
  }

  const getAvailableTeams = () => {
    const teams = new Set()
    players.forEach(player => {
      const team = player.Team || player.team
      if (team) teams.add(team)
    })
    return Array.from(teams).sort()
  }

  const totalCredits = selectedPlayers.reduce((sum, p) => sum + (p.event_player_credit || p.credits || 0), 0)
  const roleCounts = getRoleCounts(selectedPlayers)
  const validation = validateTeam(selectedPlayers)

  const handleContinue = () => {
    if (!validation.isValid) {
      alert(validation.errors.join('\n'))
      return
    }
    // Navigate to captain selection with team data
    const teamId = editingTeamId || 'new'
    // If editing, pass existing captain and vice-captain
    const existingTeam = location.state?.editingTeam
    navigate(`/pick-captain/${matchId}/${teamId}`, { 
      state: { 
        selectedPlayers,
        existingCaptain: existingTeam?.captain || null,
        existingViceCaptain: existingTeam?.viceCaptain || null
      } 
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading players...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadPlayers}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const availableTeams = getAvailableTeams()

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/matches')}
          className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
        >
          ← Back to Matches
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingTeamId ? 'Edit Your Team' : 'Pick Your Team'}
            </h1>
            <p className="text-gray-600 mt-2">Select 11 players within 100 credits</p>
          </div>
          {editingTeamId && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-semibold">
              Editing Team
            </span>
          )}
        </div>
      </div>

      {/* Team Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Players Selected</p>
            <p className="text-2xl font-bold text-indigo-600">{selectedPlayers.length}/11</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credits Used</p>
            <p className={`text-2xl font-bold ${totalCredits > 100 ? 'text-red-600' : 'text-green-600'}`}>
              {totalCredits}/100
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credits Left</p>
            <p className={`text-2xl font-bold ${100 - totalCredits < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {Math.max(0, 100 - totalCredits)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Team Status</p>
            <p className={`text-lg font-bold ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validation.isValid ? 'Valid ✓' : 'Invalid ✗'}
            </p>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Role Distribution:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded ${roleCounts['Batsman'] >= 3 && roleCounts['Batsman'] <= 7 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-xs text-gray-600">Batsman</p>
              <p className="text-lg font-bold">{roleCounts['Batsman']} (3-7)</p>
            </div>
            <div className={`p-3 rounded ${roleCounts['Wicket Keeper'] >= 1 && roleCounts['Wicket Keeper'] <= 5 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-xs text-gray-600">Wicket Keeper</p>
              <p className="text-lg font-bold">{roleCounts['Wicket Keeper']} (1-5)</p>
            </div>
            <div className={`p-3 rounded ${roleCounts['All Rounder'] >= 0 && roleCounts['All Rounder'] <= 4 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-xs text-gray-600">All Rounder</p>
              <p className="text-lg font-bold">{roleCounts['All Rounder']} (0-4)</p>
            </div>
            <div className={`p-3 rounded ${roleCounts['Bowler'] >= 3 && roleCounts['Bowler'] <= 7 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-xs text-gray-600">Bowler</p>
              <p className="text-lg font-bold">{roleCounts['Bowler']} (3-7)</p>
            </div>
          </div>
        </div>

        {validation.errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm font-semibold text-red-800 mb-1">Issues:</p>
            <ul className="text-xs text-red-700 list-disc list-inside">
              {validation.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Player</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Team</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Teams</option>
              {availableTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Credits</label>
            <select
              onChange={(e) => handleCreditFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CREDIT_RANGES.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Players List - Sorted by Role */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Available Players ({getFilteredPlayers().length})
        </h2>
        
        {(() => {
          const { grouped, roleOrder } = getSortedPlayersByRole()
          const allRoles = [...roleOrder, ...Object.keys(grouped).filter(r => !roleOrder.includes(r))]
          
          return (
            <div className="space-y-6">
              {allRoles.map(role => {
                const rolePlayers = grouped[role] || []
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
                        const team = player.team_name || player.team || 'N/A'
                        const credits = player.event_player_credit || player.credits || 0
                        const selected = isPlayerSelected(player)
                        const logo = player.team_logo || player.teamLogo || '/default-team-logo.png'
                        const points = player.event_total_points || player.points || 0

                        return (
                          <div
                            key={playerId}
                            onClick={() => togglePlayer(player)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selected
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
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
                                <p className='text-xs text-gray-500'> Total Points</p>
                              </div>

                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <img className='h-10' src={logo} alt="" />
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {team}
                              </span>
                              {selected && (
                                <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded font-semibold">
                                  Selected ✓
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!validation.isValid}
          className={`px-8 py-3 rounded-md font-semibold transition-colors ${
            validation.isValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Captain Selection →
        </button>
      </div>
    </div>
  )
}

export default PickPlayers
