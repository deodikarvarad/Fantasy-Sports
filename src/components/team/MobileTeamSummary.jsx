function MobileTeamSummary({ selectedPlayers, totalCredits, roleCounts, validation, availableTeams }) {
  // Count players by team
  const teamCounts = {}
  selectedPlayers.forEach(player => {
    const team = player.team_name || player.Team || player.team || 'Unknown'
    teamCounts[team] = (teamCounts[team] || 0) + 1
  })

  const teams = Object.keys(teamCounts)
  const selectedCount = selectedPlayers.length
  const creditsLeft = 100 - totalCredits

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-4 border border-blue-200">
      {/* Team Logos and Counts */}
      {/* {teams.length > 0 && (
        <div className="flex items-center justify-center space-x-6 mb-4">
          {teams.slice(0, 2).map((team, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-500 shadow-md">
                  <span className="text-xs font-bold text-gray-700">{team.substring(0, 3).toUpperCase()}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">{teamCounts[team]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )} */}

      {/* Selection Rules */}
      <div className="text-center mb-1">
        <p className="text-xs text-gray-600 ">Max 7 players from a team</p>
        <div className="flex items-center justify-center space-x-2 ">
          <span className="text-lg font-bold text-gray-800">{selectedCount}/11 Players</span>
        </div>
        <p className="text-sm font-semibold text-gray-700">
          {creditsLeft >= 0 ? `${creditsLeft} Credits Left` : `${Math.abs(creditsLeft)} Credits Over`}
        </p>
      </div>

      {/* Player Progress Circles */}
      <div className="flex justify-center space-x-1 mb-1">
        {Array.from({ length: 11 }).map((_, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              idx < selectedCount
                ? 'bg-red-600 text-white'
                : 'bg-white border-2 border-red-600'
            }`}
          >
            {idx < selectedCount && idx === selectedCount - 1 ? selectedCount : ''}
          </div>
        ))}
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-blue-300">
        <div className="text-center">
          <p className="text-xs text-gray-600">WK</p>
          <p className={`text-sm font-bold ${roleCounts['Wicket Keeper'] >= 1 && roleCounts['Wicket Keeper'] <= 5 ? 'text-green-600' : 'text-red-600'}`}>
            {roleCounts['Wicket Keeper'] || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Bat</p>
          <p className={`text-sm font-bold ${roleCounts['Batsman'] >= 3 && roleCounts['Batsman'] <= 7 ? 'text-green-600' : 'text-red-600'}`}>
            {roleCounts['Batsman'] || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">AR</p>
          <p className={`text-sm font-bold ${roleCounts['All Rounder'] >= 0 && roleCounts['All Rounder'] <= 4 ? 'text-green-600' : 'text-red-600'}`}>
            {roleCounts['All Rounder'] || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Bowl</p>
          <p className={`text-sm font-bold ${roleCounts['Bowler'] >= 3 && roleCounts['Bowler'] <= 7 ? 'text-green-600' : 'text-red-600'}`}>
            {roleCounts['Bowler'] || 0}
          </p>
        </div>
      </div>

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-xs font-semibold mb-1">Issues:</p>
          <ul className="text-red-500 text-xs space-y-0.5">
            {validation.errors.slice(0, 2).map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MobileTeamSummary
