const API_BASE_URL = 'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports'

export const fetchUpcomingMatches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Get_All_upcoming_Matches.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch matches')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching matches:', error)
    throw error
  }
}

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Get_All_Players_of_match.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch players')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error
  }
}
