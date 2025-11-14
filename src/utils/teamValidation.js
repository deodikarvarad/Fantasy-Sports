// Normalize role names to handle variations
const normalizeRole = (role) => {
  if (!role) return null
  const roleLower = role.toLowerCase().trim()
  
  if (roleLower.includes('batsman') || roleLower === 'bat') {
    return 'Batsman'
  }
  if (roleLower.includes('wicket') || roleLower.includes('keeper') || roleLower === 'wk' || roleLower === 'wicketkeeper') {
    return 'Wicket Keeper'
  }
  if (roleLower.includes('all') && roleLower.includes('rounder') || roleLower === 'ar' || roleLower === 'allrounder') {
    return 'All Rounder'
  }
  if (roleLower.includes('bowler') || roleLower === 'bowl') {
    return 'Bowler'
  }
  
  // Return original if no match found
  return role
}

export const validateTeam = (selectedPlayers) => {
  const errors = []
  const warnings = []

  if (selectedPlayers.length !== 11) {
    errors.push(`You must select exactly 11 players. Currently selected: ${selectedPlayers.length}`)
    return { isValid: false, errors, warnings }
  }

  // Calculate total credits
  const totalCredits = selectedPlayers.reduce((sum, player) => sum + (player.event_player_credit || player.Credits || player.credits || 0), 0)
  if (totalCredits > 100) {
    errors.push(`Total credits exceed 100. Current total: ${totalCredits}`)
  }

  // Count players by role
  const roleCounts = {
    'Batsman': 0,
    'Wicket Keeper': 0,
    'All Rounder': 0,
    'Bowler': 0
  }

  selectedPlayers.forEach(player => {
    const role = normalizeRole(player.Role || player.role)
    if (role && roleCounts.hasOwnProperty(role)) {
      roleCounts[role]++
    }
  })

  // Validate role restrictions
  if (roleCounts['Batsman'] < 3 || roleCounts['Batsman'] > 7) {
    errors.push(`Batsman count must be between 3-7. Current: ${roleCounts['Batsman']}`)
  }
  if (roleCounts['Wicket Keeper'] < 1 || roleCounts['Wicket Keeper'] > 5) {
    errors.push(`Wicket Keeper count must be between 1-5. Current: ${roleCounts['Wicket Keeper']}`)
  }
  if (roleCounts['All Rounder'] < 0 || roleCounts['All Rounder'] > 4) {
    errors.push(`All Rounder count must be between 0-4. Current: ${roleCounts['All Rounder']}`)
  }
  if (roleCounts['Bowler'] < 3 || roleCounts['Bowler'] > 7) {
    errors.push(`Bowler count must be between 3-7. Current: ${roleCounts['Bowler']}`)
  }

  // Check max players from one team (max 7)
  const teamCounts = {}
  selectedPlayers.forEach(player => {
    const team = player.team_name || player.team
    teamCounts[team] = (teamCounts[team] || 0) + 1
  })

  Object.entries(teamCounts).forEach(([team, count]) => {
    if (count > 7) {
      errors.push(`Maximum 7 players allowed from one team. ${team} has ${count} players`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    roleCounts,
    totalCredits,
    teamCounts
  }
}

export const getRoleCounts = (selectedPlayers) => {
  const roleCounts = {
    'Batsman': 0,
    'Wicket Keeper': 0,
    'All Rounder': 0,
    'Bowler': 0
  }

  selectedPlayers.forEach(player => {
    const role = normalizeRole(player.Role || player.role)
    if (role && roleCounts.hasOwnProperty(role)) {
      roleCounts[role]++
    }
  })

  return roleCounts
}

// Export normalizeRole for use in other components
export { normalizeRole }
