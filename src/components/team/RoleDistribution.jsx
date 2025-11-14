function RoleDistribution({ roleCounts, validation }) {
  const roleConfig = [
    { key: 'Batsman', label: 'Batsman', min: 3, max: 7, color: 'bg-blue-500' },
    { key: 'Wicket Keeper', label: 'Wicket Keeper', min: 1, max: 5, color: 'bg-purple-500' },
    { key: 'All Rounder', label: 'All Rounder', min: 0, max: 4, color: 'bg-yellow-500' },
    { key: 'Bowler', label: 'Bowler', min: 3, max: 7, color: 'bg-green-500' },
  ]

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-md">
      <h3 className="text-gray-800 font-bold text-lg mb-4">Role Distribution</h3>
      <div className="grid grid-rows-2 md:grid-rows-4 gap-3">
        {roleConfig.map(({ key, label, min, max, color }) => {
          const count = roleCounts[key] || 0
          const isValid = count >= min && count <= max
          
          return (
            <div
              key={key}
              className={`rounded-lg p-3 border-2 ${
                isValid
                  ? 'bg-gray-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 text-sm font-semibold">{label}</span>
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
              </div>
              <p className={`text-xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {count}
              </p>
              <p className="text-gray-600 text-xs">({min}-{max})</p>
            </div>
          )
        })}
      </div>
      {validation.errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-600 text-xs font-semibold mb-2">Issues:</p>
          <ul className="text-red-500 text-xs space-y-1">
            {validation.errors.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RoleDistribution
