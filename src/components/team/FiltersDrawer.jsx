import { useEffect } from 'react'

const ROLES = ['All', 'Batsman', 'Wicket Keeper', 'All Rounder', 'Bowler']
const CREDIT_RANGES = [
  { label: 'All', min: 0, max: 100 },
  { label: '0-5', min: 0, max: 5 },
  { label: '6-8', min: 6, max: 8 },
  { label: '9-10', min: 9, max: 10 },
  { label: '10+', min: 10, max: 100 },
]

function FiltersDrawer({ isOpen, onClose, filters, setFilters, availableTeams }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCreditFilterChange = (e) => {
    const range = e.target.value
    if (range === 'All') {
      setFilters({ ...filters, creditFilter: { min: 0, max: 100 } })
    } else {
      const selected = CREDIT_RANGES.find(r => r.label === range)
      if (selected) {
        setFilters({ ...filters, creditFilter: { min: selected.min, max: selected.max } })
      }
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-500/40 z-50 md:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-gray-800 text-xl font-bold">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Search Player</label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by name..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Role</label>
            <select
              value={filters.roleFilter}
              onChange={(e) => setFilters({ ...filters, roleFilter: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Filter by Team</label>
            <select
              value={filters.teamFilter}
              onChange={(e) => setFilters({ ...filters, teamFilter: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800"
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
              onChange={handleCreditFilterChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800"
            >
              {CREDIT_RANGES.map(range => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

export default FiltersDrawer
