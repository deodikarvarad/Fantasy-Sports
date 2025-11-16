function PlayerCard({ player, isSelected, onToggle, showActions = true }) {
  const name = player.Name || player.name || 'Unknown'
  const role = player.Role || player.role || 'N/A'
  const team = player.team_name || player.Team || player.team || 'N/A'
  const credits = player.event_player_credit || player.Credits || player.credits || 0
  const logo = player.team_logo || player.teamLogo || '/default-team-logo.png'
  const points = player.event_total_points || player.points || 0
  const teamShortName = player.team_short_name || player.Team_Short_Name || player.teamShortName || 'N/A'

  return (
    <div
      onClick={showActions ? onToggle : undefined}
      className={`p-4 rounded-lg border-2 transition-all ${showActions ? 'cursor-pointer' : ''} ${
        isSelected
          ? 'bg-red-50 border-red-500 shadow-md'
          : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-2">
          <div className="flex items-center space-x-2">
          <img className="h-8 w-8 object-contain" src={logo} alt={team} />
          {/* <span className="text-gray-700 text-sm font-medium">{team}</span> */}
           <h3 className="font-bold text-gray-800 text-base mb-1">{name}</h3>
        </div>
        <div className="flex gap-1">
          <p className="text-gray-600 text-sm">{teamShortName} -</p>
         <p className="text-gray-600 text-sm">{role}</p>
        </div>
        </div>
        <div>
        <p className="text-lg font-bold text-gray-800">{points}</p>
        <p className="text-xs text-gray-500">Points</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-red-600">{credits}</p>
          <p className="text-xs text-gray-500">Credits</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-right">
          
        </div>
      </div>

      {showActions && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className={`w-full py-2 rounded-full font-semibold text-sm transition-colors shadow-sm ${
            isSelected
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {isSelected ? '✓ Selected' : '+ Add Player'}
        </button>
      )}
    </div>
  )
}

export default PlayerCard
