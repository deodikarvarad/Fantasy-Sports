const ROLES = ['All', 'Batsman', 'Wicket Keeper', 'All Rounder', 'Bowler']
const CREDIT_RANGES = [
  { label: 'All', min: 0, max: 100 },
  { label: '0-5', min: 0, max: 5 },
  { label: '6-8', min: 6, max: 8 },
  { label: '9-10', min: 9, max: 10 },
  { label: '10+', min: 10, max: 100 },
]

function FiltersSidebar({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  teamFilter,
  setTeamFilter,
  creditFilter,
  setCreditFilter,
  availableTeams,
}) {
  const handleCreditFilterChange = (range) => {
    if (range === 'All') {
      setCreditFilter({ min: 0, max: 100 })
    } else {
      const selected = CREDIT_RANGES.find(r => r.label === range)
      if (selected) {
        setCreditFilter({ min: selected.min, max: selected.max })
      }
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-md space-y-4">
      <h3 className="text-gray-800 font-bold text-lg mb-4">Filters</h3>
      
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Search Player</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Role</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {ROLES.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Team</label>
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="All">All Teams</option>
          {availableTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Credits</label>
        <select
          onChange={(e) => handleCreditFilterChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {CREDIT_RANGES.map(range => (
            <option key={range.label} value={range.label}>{range.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FiltersSidebar
