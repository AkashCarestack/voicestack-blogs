import React, { createContext, useContext, useState } from 'react';

interface HeaderContextType {
  showTopStrip: boolean;
  setShowTopStrip: (show: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  showTopStrip: true,
  setShowTopStrip: () => {},
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

  return (
    <HeaderContext.Provider value={{ showTopStrip, setShowTopStrip }}>
      {children}
    </HeaderContext.Provider>
  );
}

