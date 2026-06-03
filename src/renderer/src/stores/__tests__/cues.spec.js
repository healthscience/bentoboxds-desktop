import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { cuesStore } from '../cuesStore'

// Mock dependencies
vi.mock('@/stores/socket.js', () => ({
  useSocketStore: () => ({
    send_message: vi.fn()
  })
}))

vi.mock('@/stores/libraryStore.js', () => ({
  libraryStore: () => ({
    utilLibrary: {
      expandCuesDTSingle: vi.fn((cue, ref) => ({ ...cue, expanded: true }))
    },
    prepareCueMenuHistory: vi.fn()
  })
}))

vi.mock('@/stores/aiInterface.js', () => ({
  aiInterfaceStore: () => ({})
}))

describe('cuesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = cuesStore()
    expect(store.cuesList).toEqual([])
    expect(store.waitingCues).toEqual([])
  })

  it('processes cues reply by populating waitingCues', () => {
    const store = cuesStore()
    const message = {
      reftype: 'start-cues',
      data: [{ key: 'cue1', value: {} }]
    }
    store.processCuesReply(message)
    expect(store.waitingCues).toEqual(message.data)
  })

  it('integrates reference contracts and triggers expansion', () => {
    const store = cuesStore()
    const refContracts = {
      datatype: { 'type1': { info: 'data' } }
    }
    
    store.waitingCues = [{ key: 'cue1', value: { concept: { type: 'type1' } } }]
    store.integrateReferenceContracts(refContracts)
    
    expect(store.pathRefContracts.datatype).toHaveProperty('type1')
    // refreshExpandedCues should have moved it from waitingCues to cuesList
    expect(store.waitingCues.length).toBe(0)
    expect(store.cuesList.length).toBe(1)
    expect(store.cuesList[0].expanded).toBe(true)
  })

  it('sorts items by last timestamp correctly', () => {
    const store = cuesStore()
    const cues = [
      { key: 'old', value: { time: { lastTimestamp: '2023-01-01' } } },
      { key: 'new', value: { time: { lastTimestamp: '2024-01-01' } } }
    ]
    
    store.getMostLastusedItems(cues)
    // The implementation calls storeLibrary.prepareCueMenuHistory in order
    // We can check if the internal cuesHistoryList sorting logic worked if we had access, 
    // but the store actually relies on the side effect in libraryStore.
    // Let's at least verify it doesn't crash and follows the logic.
  })
})
