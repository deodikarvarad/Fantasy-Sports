import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { saveTeam } from '../utils/storage'

function PickCaptain() {
  const { matchId, teamId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [captain, setCaptain] = useState(null)
  const [viceCaptain, setViceCaptain] = useState(null)

  useEffect(() => {
    // Get players from navigation state or load from storage if editing
    if (location.state?.selectedPlayers) {
      setSelectedPlayers(location.state.selectedPlayers)
      // Pre-select captain and vice-captain if they exist (from editing)
      if (location.state?.existingCaptain) {
        setCaptain(location.state.existingCaptain)
      }
      if (location.state?.existingViceCaptain) {
        setViceCaptain(location.state.existingViceCaptain)
      }
    } else if (teamId && teamId !== 'new') {
      // Load existing team for editing
      const teams = JSON.parse(localStorage.getItem(`teams_${matchId}`) || '[]')
      const team = teams.find(t => t.id === teamId)
      if (team) {
        setSelectedPlayers(team.players || [])
        setCaptain(team.captain || null)
        setViceCaptain(team.viceCaptain || null)
      }
    }
  }, [location.state, matchId, teamId])

  const handleCaptainSelect = (player) => {
    if (viceCaptain && (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)) {
      alert('Captain and Vice-Captain must be different players')
      return
    }
    setCaptain(player)
  }

  const handleViceCaptainSelect = (player) => {
    if (captain && (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)) {
      alert('Captain and Vice-Captain must be different players')
      return
    }
    setViceCaptain(player)
  }

  const handleSaveTeam = () => {
    if (!captain || !viceCaptain) {
      alert('Please select both Captain and Vice-Captain')
      return
    }

    const team = {
      players: selectedPlayers,
      captain,
      viceCaptain,
      createdAt: new Date().toISOString(),
    }

    if (teamId && teamId !== 'new') {
      // Update existing team
      const teams = JSON.parse(localStorage.getItem(`teams_${matchId}`) || '[]')
      const index = teams.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams[index] = { ...team, id: teamId, matchId }
        localStorage.setItem(`teams_${matchId}`, JSON.stringify(teams))
      }
    } else {
      // Save new team
      saveTeam(matchId, team)
    }

    navigate(`/my-teams/${matchId}`)
  }

  const isCaptain = (player) => {
    if (!captain) return false
    return (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)
  }

  const isViceCaptain = (player) => {
    if (!viceCaptain) return false
    return (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)
  }

  if (selectedPlayers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No players selected. Please go back and select players.</p>
        <button
          onClick={() => navigate(`/pick-players/${matchId}`)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Player Selection
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(`/pick-players/${matchId}`)}
          className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
        >
          ← Back to Player Selection
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Select Captain & Vice-Captain</h1>
        <p className="text-gray-600 mt-2">Choose your team's captain and vice-captain</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Captain gets 2x points and Vice-Captain gets 1.5x points
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Captain Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Select Captain {captain && '✓'}
          </h2>
          {captain && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="font-semibold text-indigo-900">
                {captain.Name || captain.name}
              </p>
              <p className="text-sm text-indigo-700">
                {captain.Role || captain.role} • {captain.Team || captain.team}
              </p>
            </div>
          )}
        </div>

        {/* Vice-Captain Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Select Vice-Captain {viceCaptain && '✓'}
          </h2>
          {viceCaptain && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-900">
                {viceCaptain.Name || viceCaptain.name}
              </p>
              <p className="text-sm text-green-700">
                {viceCaptain.Role || viceCaptain.role} • {viceCaptain.Team || viceCaptain.team}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Selected Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedPlayers.map((player, index) => {
            const playerId = player.id || player.Player_Id || player.player_id || index
            const name = player.Name || player.name || 'Unknown'
            const role = player.Role || player.role || 'N/A'
            const team = player.Team || player.team || 'N/A'
            const credits = player.Credits || player.credits || 0
            const isCap = isCaptain(player)
            const isVC = isViceCaptain(player)

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
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">{credits}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {team}
                  </span>
                  <div className="flex space-x-2">
                    {!isCap && (
                      <button
                        onClick={() => handleCaptainSelect(player)}
                        className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                      >
                        Captain
                      </button>
                    )}
                    {!isVC && (
                      <button
                        onClick={() => handleViceCaptainSelect(player)}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        VC
                      </button>
                    )}
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

      {/* Save Button */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/pick-players/${matchId}`)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTeam}
          disabled={!captain || !viceCaptain}
          className={`px-8 py-3 rounded-md font-semibold transition-colors ${
            captain && viceCaptain
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Team
        </button>
      </div>
    </div>
  )
}

export default PickCaptain
