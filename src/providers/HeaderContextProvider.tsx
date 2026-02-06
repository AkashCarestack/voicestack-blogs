import React, { createContext, useContext, useState } from 'react';

interface HeaderContextType {
  showTopStrip: boolean;
  setShowTopStrip: (show: boolean) => void;
  showMainHeader: boolean;
  setShowMainHeader: (show: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  showTopStrip: true,
  setShowTopStrip: () => {},
  showMainHeader: true,
  setShowMainHeader: () => {},
});

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderContextProvider');
  }
  return context;
};

interface HeaderContextProviderProps {
  children: React.ReactNode;
}

export default function HeaderContextProvider({ children }: HeaderContextProviderProps) {
  const [showTopStrip, setShowTopStrip] = useState(true);
  const [showMainHeader, setShowMainHeader] = useState(true);

  return (
    <HeaderContext.Provider value={{ showTopStrip, setShowTopStrip, showMainHeader, setShowMainHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

