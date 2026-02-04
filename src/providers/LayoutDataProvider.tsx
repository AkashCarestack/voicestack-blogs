import React, { createContext, useContext, useEffect, useState } from 'react';

interface LayoutDataContextType {
  headerData: any;
  footerData: any;
  siteSettings: any;
  contactData: any;
  loading: boolean;
  error: string | null;
  schemaData: any;
}

const LayoutDataContext = createContext<LayoutDataContextType>({
  headerData: null,
  footerData: null,
  siteSettings: null,
  contactData: null,
  loading: true,
  error: null,
  schemaData: null,
});

export const useLayoutData = () => {
  const context = useContext(LayoutDataContext);
  if (!context) {
    throw new Error('useLayoutData must be used within a LayoutDataProvider');
  }
  return context;
};

interface LayoutDataProviderProps {
  children: React.ReactNode;
  initialHeaderData?: any;
  initialFooterData?: any;
  initialSiteSettings?: any;
  initialContactData?: any;
  initialSchemaData?: any;
}

export default function LayoutDataProvider({ 
  children,
  initialHeaderData = null,
  initialFooterData = null,
  initialSiteSettings = null,
  initialContactData = null,
  initialSchemaData = null,
}: LayoutDataProviderProps) {
  const [headerData, setHeaderData] = useState(initialHeaderData);
  const [footerData, setFooterData] = useState(initialFooterData);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [contactData, setContactData] = useState(initialContactData);
  const [loading, setLoading] = useState(!initialHeaderData && !initialFooterData);
  const [schemaData, setSchemaData] = useState(initialSchemaData);
  const [error, setError] = useState<string | null>(null);

  // Sync props to state when they change (important for client-side navigation)
  // This ensures that when getInitialProps provides new data during navigation, we update state
  // getInitialProps runs server-side on initial load, and client-side during navigation
  useEffect(() => {
    // Only update state if we have valid data (not null/undefined)
    // This prevents clearing existing state during navigation when getInitialProps is still fetching
    if (initialHeaderData !== null && initialHeaderData !== undefined) {
      setHeaderData(initialHeaderData);
    }
    if (initialFooterData !== null && initialFooterData !== undefined) {
      setFooterData(initialFooterData);
    }
    if (initialSiteSettings !== null && initialSiteSettings !== undefined) {
      setSiteSettings(initialSiteSettings);
    }
    if (initialContactData !== null && initialContactData !== undefined) {
      setContactData(initialContactData);
    }
    if (initialSchemaData !== null && initialSchemaData !== undefined) {
      setSchemaData(initialSchemaData);
    }
    
    // Update loading state based on whether we have data
    if (initialHeaderData && initialFooterData) {
      setLoading(false);
      setError(null);
    }
    // Don't set loading to true if props are null during navigation - preserve existing state
  }, [initialHeaderData, initialFooterData, initialSiteSettings, initialContactData]);

  return (
    <LayoutDataContext.Provider value={{ headerData, footerData, siteSettings, contactData, loading, schemaData, error }}>
      {children}
    </LayoutDataContext.Provider>
  );
}
