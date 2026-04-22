// Simple module-level callback for pricing demo modal
// This allows PracticeTypeModal to trigger the pricing demo modal without context

import { type LocCategory } from './resolveDemoMeetingLink'

type PricingDemoModalCallback = ((practiceType: string, loc?: LocCategory) => void) | null

let pricingDemoModalCallback: PricingDemoModalCallback = null

export const setPricingDemoModalCallback = (callback: PricingDemoModalCallback) => {
  pricingDemoModalCallback = callback
}

export const getPricingDemoModalCallback = (): PricingDemoModalCallback => {
  return pricingDemoModalCallback
}

export const clearPricingDemoModalCallback = () => {
  pricingDemoModalCallback = null
}

