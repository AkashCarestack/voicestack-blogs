import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getClient } from '~/lib/sanity.client';
import { getHeaderData, getFooterData } from '~/lib/sanity.queries';

interface LayoutDataContextType {
  headerData: any;
  footerData: any;
  loading: boolean;
}

const LayoutDataContext = createContext<LayoutDataContextType>({
  headerData: null,
  footerData: null,
  loading: true,
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
}

export default function LayoutDataProvider({ children }: LayoutDataProviderProps) {
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const region = router.locale || 'en';
        const client = getClient();
        
        const [header, footer] = await Promise.all([
          getHeaderData(client, region),
          getFooterData(client, region)
        ]);
        
        setHeaderData(header);
        setFooterData(footer);
      } catch (error) {
        console.error('Error fetching layout data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
  }, [router.locale]);

  return (
    <LayoutDataContext.Provider value={{ headerData, footerData, loading }}>
      {children}
    </LayoutDataContext.Provider>
  );
}
