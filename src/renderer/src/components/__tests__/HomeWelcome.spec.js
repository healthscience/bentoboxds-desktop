import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppWelcome from '@/components/toolbars/mainTools.vue'

describe('App base welcome layout', () => {
  it('renders properly', () => {
    const wrapper = mount(AppWelcome)
    expect(wrapper.find(".logo-words").text().toContain('BentoBox-DS'))
  })
})
