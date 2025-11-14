// Local storage utilities for managing teams

export const saveTeam = (matchId, team) => {
  const teams = getTeamsForMatch(matchId)
  const teamId = team.id || Date.now().toString()
  const teamToSave = { ...team, id: teamId, matchId }
  
  teams.push(teamToSave)
  localStorage.setItem(`teams_${matchId}`, JSON.stringify(teams))
  return teamId
}

export const getTeamsForMatch = (matchId) => {
  const teamsJson = localStorage.getItem(`teams_${matchId}`)
  return teamsJson ? JSON.parse(teamsJson) : []
}

export const updateTeam = (matchId, teamId, updatedTeam) => {
  const teams = getTeamsForMatch(matchId)
  const index = teams.findIndex(t => t.id === teamId)
  if (index !== -1) {
    teams[index] = { ...updatedTeam, id: teamId, matchId }
    localStorage.setItem(`teams_${matchId}`, JSON.stringify(teams))
    return true
  }
  return false
}

export const deleteTeam = (matchId, teamId) => {
  const teams = getTeamsForMatch(matchId)
  const filtered = teams.filter(t => t.id !== teamId)
  localStorage.setItem(`teams_${matchId}`, JSON.stringify(filtered))
}
