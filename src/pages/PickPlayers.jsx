import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { fetchPlayers } from '../services/api'
import { useTeamBuilder } from '../hooks/useTeamBuilder'
import TeamHeader from '../components/team/TeamHeader'
import TeamSummary from '../components/team/TeamSummary'
import RoleDistribution from '../components/team/RoleDistribution'
import MobileTeamSummary from '../components/team/MobileTeamSummary'
import FiltersSidebar from '../components/team/FiltersSidebar'
import FiltersDrawer from '../components/team/FiltersDrawer'
import PlayersList from '../components/team/PlayersList'
import { normalizeRole } from '../utils/teamValidation'

function PickPlayers() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTeamId, setEditingTeamId] = useState(null)
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [mobileRoleTab, setMobileRoleTab] = useState('All')
  
  // Filters
  const [filters, setFilters] = useState({
    roleFilter: 'All',
    teamFilter: 'All',
    creditFilter: { min: 0, max: 100 },
    searchQuery: ''
  })

  const editingTeam = location.state?.editingTeam
  const teamBuilder = useTeamBuilder([], editingTeam)

  useEffect(() => {
    loadPlayers()
    if (editingTeam) {
      setEditingTeamId(editingTeam.id)
    }
  }, [location.state])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPlayers()
      let playersList = []
      if (data.players) {
        if (Array.isArray(data.players)) {
          playersList = data.players
        } else if (typeof data.players === 'object') {
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

  const getFilteredPlayers = () => {
    return players.filter(player => {
      const role = normalizeRole(player.Role || player.role) || (player.Role || player.role || '')
      const team = player.team_name || player.Team || player.team || ''
      const credits = player.event_player_credit || player.Credits || player.credits || 0
      const name = (player.Name || player.name || '').toLowerCase()
      
      // Use appropriate role filter
      const roleFilter = filters.roleFilter
      if (roleFilter !== 'All' && role !== roleFilter) return false
      if (filters.teamFilter !== 'All' && team !== filters.teamFilter) return false
      if (credits < filters.creditFilter.min || credits > filters.creditFilter.max) return false
      if (filters.searchQuery && !name.includes(filters.searchQuery.toLowerCase())) return false
      
      return true
    })
  }

  const getAvailableTeams = () => {
    const teams = new Set()
    players.forEach(player => {
      const team = player.team_name || player.Team || player.team
      if (team) teams.add(team)
    })
    return Array.from(teams).sort()
  }

  const handleContinue = () => {
    if (!teamBuilder.validation.isValid) {
      alert(teamBuilder.validation.errors.join('\n'))
      return
    }
    const teamId = editingTeamId || 'new'
    const existingTeam = location.state?.editingTeam
    navigate(`/pick-captain/${matchId}/${teamId}`, { 
      state: { 
        selectedPlayers: teamBuilder.selectedPlayers,
        existingCaptain: existingTeam?.captain || null,
        existingViceCaptain: existingTeam?.viceCaptain || null
      } 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading players...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPlayers}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const filteredPlayers = getFilteredPlayers()
  const availableTeams = getAvailableTeams()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <TeamHeader
        title={editingTeamId ? 'Edit Your Team' : 'Pick Your Team'}
        subtitle="Select 11 players within 100 credits"
        onBack={() => navigate('/matches')}
        showFilterButton={true}
        onFilterClick={() => setShowFiltersDrawer(true)}
      />

      {/* Mobile Team Summary - Sticky */}
      <div className="md:hidden sticky top-16 z-40 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <MobileTeamSummary
            selectedPlayers={teamBuilder.selectedPlayers}
            totalCredits={teamBuilder.totalCredits}
            roleCounts={teamBuilder.roleCounts}
            validation={teamBuilder.validation}
            availableTeams={availableTeams}
          />
          
          {/* Role Tabs */}
          <div className="bg-blue-50 rounded-lg p-2 mt-4 flex space-x-2 overflow-x-auto">
            {[
              // { key: 'All', label: 'All' },
              { key: 'Wicket Keeper', label: `WK (${teamBuilder.roleCounts['Wicket Keeper'] || 0})` },
              { key: 'Batsman', label: `Batsman (${teamBuilder.roleCounts['Batsman'] || 0})` },
              { key: 'All Rounder', label: `AR (${teamBuilder.roleCounts['All Rounder'] || 0})` },
              { key: 'Bowler', label: `Bowler (${teamBuilder.roleCounts['Bowler'] || 0})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setMobileRoleTab(key)
                  setFilters({ ...filters, roleFilter: key })
                }}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors ${
                  mobileRoleTab === key
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Role Selection Instruction */}
          {/* {mobileRoleTab !== 'All' && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-800 font-bold text-sm">
                Select {teamBuilder.roleCounts[mobileRoleTab] || 0} - {mobileRoleTab === 'Batsman' ? '7' : mobileRoleTab === 'Wicket Keeper' ? '5' : mobileRoleTab === 'All Rounder' ? '4' : '7'} {mobileRoleTab}
              </p>
            </div>
          )} */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-80 md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:bg-gray-50 md:p-4 md:border-r md:border-gray-200">
          <div className="space-y-4">
            <TeamSummary
              selectedCount={teamBuilder.selectedPlayers.length}
              totalCredits={teamBuilder.totalCredits}
              creditsLeft={100 - teamBuilder.totalCredits}
              isValid={teamBuilder.validation.isValid}
            />
            <RoleDistribution
              roleCounts={teamBuilder.roleCounts}
              validation={teamBuilder.validation}
            />
            <FiltersSidebar
              searchQuery={filters.searchQuery}
              setSearchQuery={(val) => setFilters({ ...filters, searchQuery: val })}
              roleFilter={filters.roleFilter}
              setRoleFilter={(val) => setFilters({ ...filters, roleFilter: val })}
              teamFilter={filters.teamFilter}
              setTeamFilter={(val) => setFilters({ ...filters, teamFilter: val })}
              creditFilter={filters.creditFilter}
              setCreditFilter={(val) => setFilters({ ...filters, creditFilter: val })}
              availableTeams={availableTeams}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-80 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto md:h-[calc(100vh-4rem)]">
          {/* Players List */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
            {/* <h2 className="text-gray-800 text-xl font-bold mb-4">
              Available Players ({filteredPlayers.length})
            </h2> */}
            <div className="md:max-h-[calc(100vh-12rem)] md:overflow-y-auto">
              <PlayersList
                players={filteredPlayers}
                selectedPlayers={teamBuilder.selectedPlayers}
                onTogglePlayer={teamBuilder.togglePlayer}
                isPlayerSelected={teamBuilder.isPlayerSelected}
                captain={teamBuilder.captain}
                viceCaptain={teamBuilder.viceCaptain}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <FiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        setFilters={setFilters}
        availableTeams={availableTeams}
      />

      {/* Sticky Footer Button - Mobile */}
      <div className="md:hidden fixed bottom-0 left-20 right-20 border-gray-200 mb-4">
        <div className="flex space-x-3">
          {/* <button
            onClick={() => navigate(`/my-teams/${matchId}`)}
            className="flex-1 py-3 border-2 border-red-600 text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors"
          >
            Team Preview
          </button> */}
          <button
            onClick={handleContinue}
            disabled={!teamBuilder.validation.isValid}
            className={`flex-1 py-3 rounded-full font-bold text-lg transition-colors shadow-md ${
              teamBuilder.validation.isValid
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Team
          </button>
        </div>
      </div>

      {/* Desktop Continue Button */}
      <div className="hidden md:flex justify-end mt-6 pr-6">
        <button
          onClick={handleContinue}
          disabled={!teamBuilder.validation.isValid}
          className={`px-8 py-3 mb-4 rounded-full font-bold transition-colors shadow-md ${
            teamBuilder.validation.isValid
              ? 'bg-red-600 text-white hover:bg-red-700'
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