function TeamSummary({ selectedCount, totalCredits, creditsLeft, isValid }) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border mt-5 border-gray-200 shadow-md">
      <h3 className="text-gray-800 font-bold text-lg mb-4">Team Summary</h3>
      <div className="grid grid-rows-2 md:grid-rows-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-600 text-xs mb-1">Players</p>
          <p className="text-gray-800 text-xl font-bold">{selectedCount}/11</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-600 text-xs mb-1">Credits Used</p>
          <p className={`text-xl font-bold ${totalCredits > 100 ? 'text-red-600' : 'text-green-600'}`}>
            {totalCredits}/100
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-600 text-xs mb-1">Credits Left</p>
          <p className={`text-xl font-bold ${creditsLeft < 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {Math.max(0, creditsLeft)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-600 text-xs mb-1">Status</p>
          <p className={`text-lg font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? 'Valid ✓' : 'Invalid ✗'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TeamSummary
