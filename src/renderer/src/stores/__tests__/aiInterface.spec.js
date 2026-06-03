import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { aiInterfaceStore } from '../aiInterface'

// Mock dependencies
vi.mock('@/stores/socket.js', () => ({
  useSocketStore: () => ({
    send_message: vi.fn()
  })
}))

vi.mock('@/stores/bentoboxStore.js', () => ({
  bentoboxStore: () => ({
    chatList: []
  })
}))

vi.mock('@/stores/libraryStore.js', () => ({
  libraryStore: () => ({})
}))

vi.mock('@/stores/chatStore.js', () => ({
  useChatStore: () => ({
    handleIncomingMessage: vi.fn(),
    chatHistory: []
  })
}))

vi.mock('@/stores/accountStore.js', () => ({
  accountStore: () => ({})
}))

vi.mock('@/stores/cuesStore.js', () => ({
  cuesStore: () => ({})
}))

vi.mock('@/stores/teachingStore.js', () => ({
  teachingStore: () => ({})
}))

vi.mock('@/stores/besearchStore.js', () => ({
  besearchStore: () => ({
    activeBesearchContext: { story: '' }
  })
}))

vi.mock('@/stores/orreryStore.js', () => ({
  orreryStore: () => ({})
}))

vi.mock('@/stores/lifestrapStore.js', () => ({
  lifestrapStore: () => ({})
}))

vi.mock('@/stores/loomStore.js', () => ({
  loomStore: () => ({})
}))

describe('aiInterfaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = aiInterfaceStore()
    expect(store.currentMode).toBe('zen')
    expect(store.isInitialState).toBe(true)
  })

  it('clears data correctly', () => {
    const store = aiInterfaceStore()
    store.historyPair['test'] = [{ q: 'a' }]
    
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      configurable: true
    })
    
    store.clearData()
    expect(Object.keys(store.historyPair).length).toBe(0)
    expect(reloadSpy).toHaveBeenCalled()
  })
})
