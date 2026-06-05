import * as React from 'react'
import CampaignOfferModal from '~/v2/components/common/CampaignOfferModal'
import { useExitIntent } from '~/hooks/useExitIntent'

export interface CampaignOfferExitIntentProps {
  enabled?: boolean
}

const CampaignOfferExitIntent: React.FC<CampaignOfferExitIntentProps> = ({
  enabled = true,
}) => {
  const { triggered, dismiss } = useExitIntent({ enabled })

  if (!triggered) {
    return null
  }

  return <CampaignOfferModal onClose={dismiss} />
}

export default CampaignOfferExitIntent
