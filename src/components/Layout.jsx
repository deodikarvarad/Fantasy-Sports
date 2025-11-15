import { Link, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()
  const isTeamPage = location.pathname.includes('/pick-players') || location.pathname.includes('/view-team') || location.pathname.includes('/pick-captain')

  // Don't show layout on team pages (they have their own headers)
  if (isTeamPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-red-600">Fantasy Sports</span>
              </Link>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Link
                to="/my-teams"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === '/my-teams' || location.pathname === '/'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Teams
              </Link>
            </div> */}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        {children}
      </main>
    </div>
  )
}

export default Layout
