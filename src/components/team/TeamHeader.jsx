function TeamHeader({ title, subtitle, onBack, showFilterButton, onFilterClick }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-red-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {showFilterButton && (
        <button
          onClick={onFilterClick}
          className="md:hidden px-4 py-2 bg-red-600 rounded-full text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-md"
        >
          Filters
        </button>
      )}
    </div>
  )
}

export default TeamHeader
