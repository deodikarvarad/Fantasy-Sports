import { useState, useEffect } from 'react'
import { validateTeam, getRoleCounts, normalizeRole } from '../utils/teamValidation'

export const useTeamBuilder = (initialPlayers = [], editingTeam = null) => {
  const [selectedPlayers, setSelectedPlayers] = useState(initialPlayers)
  const [captain, setCaptain] = useState(editingTeam?.captain || null)
  const [viceCaptain, setViceCaptain] = useState(editingTeam?.viceCaptain || null)

  useEffect(() => {
    if (editingTeam) {
      setSelectedPlayers(editingTeam.players || [])
      setCaptain(editingTeam.captain || null)
      setViceCaptain(editingTeam.viceCaptain || null)
    }
  }, [editingTeam])

  const togglePlayer = (player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => 
        (p.id || p.Player_Id || p.player_id) === (player.id || player.Player_Id || player.player_id)
      )
      
      if (isSelected) {
        return prev.filter(p => 
          (p.id || p.Player_Id || p.player_id) !== (player.id || player.Player_Id || player.player_id)
        )
      } else {
        if (prev.length >= 11) {
          return prev
        }
        return [...prev, player]
      }
    })
  }

  const isPlayerSelected = (player) => {
    return selectedPlayers.some(p => 
      (p.id || p.Player_Id || p.player_id) === (player.id || player.Player_Id || player.player_id)
    )
  }

  const setCaptainSelection = (player) => {
    if (viceCaptain && (player.id || player.Player_Id || player.player_id) === (viceCaptain.id || viceCaptain.Player_Id || viceCaptain.player_id)) {
      return false
    }
    setCaptain(player)
    return true
  }

  const setViceCaptainSelection = (player) => {
    if (captain && (player.id || player.Player_Id || player.player_id) === (captain.id || captain.Player_Id || captain.player_id)) {
      return false
    }
    setViceCaptain(player)
    return true
  }

  const totalCredits = selectedPlayers.reduce((sum, p) => sum + (p.event_player_credit || p.Credits || p.credits || 0), 0)
  const roleCounts = getRoleCounts(selectedPlayers)
  const validation = validateTeam(selectedPlayers)

  return {
    selectedPlayers,
    captain,
    viceCaptain,
    totalCredits,
    roleCounts,
    validation,
    togglePlayer,
    isPlayerSelected,
    setCaptainSelection,
    setViceCaptainSelection,
    setSelectedPlayers
  }
}
