import React, { createContext, useContext, useState, ReactNode } from 'react'
import { PricingFormModal } from './PricingFormModal'

interface PricingModalContextType {
  isOpen: boolean
  openPricingModal: () => void
  closePricingModal: () => void
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(
  undefined,
)

export const usePricingModal = () => {
  const context = useContext(PricingModalContext)
  return context
}

interface PricingModalProviderProps {
  children: ReactNode
}

export const PricingModalProvider: React.FC<PricingModalProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const openPricingModal = () => {
    setIsOpen(true)
  }

  const closePricingModal = () => {
    setIsOpen(false)
  }

  return (
    <PricingModalContext.Provider
      value={{
        isOpen,
        openPricingModal,
        closePricingModal,
      }}
    >
      {children}
      {isOpen && (
        <PricingFormModal
          onClose={closePricingModal}
        />
      )}
    </PricingModalContext.Provider>
  )
}

