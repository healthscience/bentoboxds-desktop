import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { orreryStore } from '../orreryStore'

// Mock dependencies
const mockIntegrate = vi.fn()
vi.mock('@/stores/cuesStore.js', () => ({
  cuesStore: () => ({
    integrateReferenceContracts: mockIntegrate
  })
}))

describe('orreryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = orreryStore()
    expect(store.seedingProgress).toBe(0)
    expect(store.isSeeding).toBe(false)
  })

  it('processes seed-base-biology reply and updates progress', () => {
    const store = orreryStore()
    const message = {
      action: 'seed-base-biology',
      data: {
        verification: { actual: 50, expected: 100 },
        referenceContracts: { datatype: {} }
      }
    }
    
    store.processReply(message)
    expect(store.seedingProgress).toBe(50)
    expect(mockIntegrate).toHaveBeenCalledWith(message.data.referenceContracts)
  })

  it('sets isSeeding to false when progress is >= 95%', () => {
    const store = orreryStore()
    store.isSeeding = true
    const message = {
      action: 'seed-base-biology',
      data: {
        verification: { actual: 96, expected: 100 }
      }
    }
    
    store.processReply(message)
    expect(store.seedingProgress).toBe(96)
    expect(store.isSeeding).toBe(false)
  })

  it('manages registry correctly', () => {
    const store = orreryStore()
    store.addToRegistry('testKey', 'testValue')
    expect(store.getFromRegistry('testKey')).toBe('testValue')
  })
})
