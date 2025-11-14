import { Link, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">🏏 Fantasy Sports</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/matches"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/matches' || location.pathname === '/'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Matches
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
