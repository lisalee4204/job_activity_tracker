import { create } from 'zustand'
import type { JobSearchActivity } from '../types'

interface DeletedActivity {
  activity: JobSearchActivity
  deletedAt: Date
  expiresAt: Date
}

interface UndoState {
  deletedActivities: Map<string, DeletedActivity>
  addDeleted: (activity: JobSearchActivity) => string // Returns undo ID
  undo: (id: string) => JobSearchActivity | null
  clearExpired: () => void
  getUndoId: (activityId: string) => string | null
}

const UNDO_DURATION_MS = 5 * 60 * 1000 // 5 minutes

export const useUndoStore = create<UndoState>((set, get) => ({
  deletedActivities: new Map(),

  addDeleted: (activity) => {
    const undoId = Math.random().toString(36).substring(7)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + UNDO_DURATION_MS)

    set((state) => {
      const newMap = new Map(state.deletedActivities)
      newMap.set(undoId, {
        activity,
        deletedAt: now,
        expiresAt,
      })
      return { deletedActivities: newMap }
    })

    // Auto-clear expired after duration
    setTimeout(() => {
      get().clearExpired()
    }, UNDO_DURATION_MS)

    return undoId
  },

  undo: (id) => {
    const state = get()
    const deleted = state.deletedActivities.get(id)
    
    if (!deleted) return null
    
    // Remove from undo store
    set((state) => {
      const newMap = new Map(state.deletedActivities)
      newMap.delete(id)
      return { deletedActivities: newMap }
    })

    return deleted.activity
  },

  clearExpired: () => {
    const now = new Date()
    set((state) => {
      const newMap = new Map()
      state.deletedActivities.forEach((deleted, id) => {
        if (deleted.expiresAt > now) {
          newMap.set(id, deleted)
        }
      })
      return { deletedActivities: newMap }
    })
  },

  getUndoId: (activityId) => {
    const state = get()
    for (const [undoId, deleted] of state.deletedActivities.entries()) {
      if (deleted.activity.id === activityId) {
        return undoId
      }
    }
    return null
  },
}))







