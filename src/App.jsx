import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UpcomingMatches from './pages/UpcomingMatches'
import PickPlayers from './pages/PickPlayers'
import PickCaptain from './pages/PickCaptain'
import MyTeams from './pages/MyTeams'
import ViewTeam from './pages/ViewTeam'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<UpcomingMatches />} />
          <Route path="/matches" element={<UpcomingMatches />} />
          <Route path="/pick-players/:matchId" element={<PickPlayers />} />
          <Route path="/pick-captain/:matchId/:teamId" element={<PickCaptain />} />
          <Route path="/my-teams/:matchId" element={<MyTeams />} />
          <Route path="/view-team/:matchId/:teamId" element={<ViewTeam />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
