import React, { createContext, useContext, useEffect, useState } from 'react';

interface LayoutDataContextType {
  headerData: any;
  footerData: any;
  siteSettings: any;
  contactData: any;
  loading: boolean;
  error: string | null;
  schemaData: any;
  featuresData: any[];
  featureDataWithCategory: any[];
  region: string;
}

const LayoutDataContext = createContext<LayoutDataContextType>({
  headerData: null,
  footerData: null,
  siteSettings: null,
  contactData: null,
  loading: true,
  error: null,
  schemaData: null,
  featuresData: [],
  featureDataWithCategory: [],
  region: 'en',
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
  initialFeaturesData?: any[];
  initialFeatureDataWithCategory?: any[];
  initialRegion?: string;
}

export default function LayoutDataProvider({ 
  children,
  initialHeaderData = null,
  initialFooterData = null,
  initialSiteSettings = null,
  initialContactData = null,
  initialSchemaData = null,
  initialFeaturesData = [],
  initialFeatureDataWithCategory = [],
  initialRegion = 'en',
}: LayoutDataProviderProps) {
  const [headerData, setHeaderData] = useState(initialHeaderData);
  const [footerData, setFooterData] = useState(initialFooterData);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [contactData, setContactData] = useState(initialContactData);
  const [loading, setLoading] = useState(!initialHeaderData && !initialFooterData);
  const [schemaData, setSchemaData] = useState(initialSchemaData);
  const [featuresData, setFeaturesData] = useState(initialFeaturesData || []);
  const [error, setError] = useState<string | null>(null);
  const [featureDataWithCategory, setFeatureDataWithCategory] = useState(initialFeatureDataWithCategory || []);
  const [region, setRegion] = useState(initialRegion);

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
    if (initialFeaturesData !== null && initialFeaturesData !== undefined) {
      setFeaturesData(initialFeaturesData);
    }
    if (initialFeatureDataWithCategory !== null && initialFeatureDataWithCategory !== undefined) {
      setFeatureDataWithCategory(initialFeatureDataWithCategory);
    }
    if (initialRegion) {
      setRegion(initialRegion);
    }
    
    // Update loading state based on whether we have data
    if (initialHeaderData && initialFooterData) {
      setLoading(false);
      setError(null);
    }
    // Don't set loading to true if props are null during navigation - preserve existing state
  }, [initialHeaderData, initialFooterData, initialSiteSettings, initialContactData, initialSchemaData, initialFeaturesData, initialFeatureDataWithCategory, initialRegion]);

  return (
    <LayoutDataContext.Provider value={{ headerData, footerData, siteSettings, contactData, loading, schemaData, featuresData, error , featureDataWithCategory, region}}>
      {children}
    </LayoutDataContext.Provider>
  );
}
