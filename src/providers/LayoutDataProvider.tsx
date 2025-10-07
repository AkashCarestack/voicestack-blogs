import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getClient } from '~/lib/sanity.client';
import { getHeaderData, getFooterData } from '~/lib/sanity.queries';

interface LayoutDataContextType {
  headerData: any;
  footerData: any;
  loading: boolean;
  error: string | null;
}

const LayoutDataContext = createContext<LayoutDataContextType>({
  headerData: null,
  footerData: null,
  loading: true,
  error: null,
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        console.log('LayoutDataProvider: Starting data fetch...');
        const region = router.locale || 'en';
        console.log('LayoutDataProvider: Using region:', region);
        
        // Check environment variables
        console.log('LayoutDataProvider: Environment check:', {
          hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
          hasReadToken: !!process.env.SANITY_API_READ_TOKEN,
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
        });
        
        const client = getClient();
        console.log('LayoutDataProvider: Sanity client created');
        
        // Test basic connectivity first
        console.log('LayoutDataProvider: Testing Sanity connectivity...');
        try {
          const testQuery = `*[_type == "homeSettings"] | order(_createdAt desc) [0..2] { _id, language, _type }`;
          const testResult = await client.fetch(testQuery);
          console.log('LayoutDataProvider: Test query result:', testResult);
        } catch (testError) {
          console.error('LayoutDataProvider: Test query failed:', testError);
        }
        
        // Test individual queries
        console.log('LayoutDataProvider: Fetching header data...');
        const header = await getHeaderData(client, region);
        console.log('LayoutDataProvider: Header data received:', header);
        
        console.log('LayoutDataProvider: Fetching footer data...');
        const footer = await getFooterData(client, region);
        console.log('LayoutDataProvider: Footer data received:', footer);
        
        // Check if data is null or empty
        if (!header) {
          console.warn('LayoutDataProvider: Header data is null/undefined');
        }
        if (!footer) {
          console.warn('LayoutDataProvider: Footer data is null/undefined');
        }
        
        setHeaderData(header);
        setFooterData(footer);
        setError(null);
      } catch (error) {
        console.error('LayoutDataProvider: Error fetching layout data:', error);
        console.error('LayoutDataProvider: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message);
        
        // Set fallback data to prevent null data issues
        setHeaderData({
          navigationMenu: [],
          topNavigationMenu: [],
          phoneNumber: '',
          ctabutton: 'Book Demo'
        });
        setFooterData({
          title: 'VoiceStack',
          footerColumns: [],
          socialMedia: {},
          bottomLinks: [],
          copyrightText: '© 2024 VoiceStack. All rights reserved.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
  }, [router.locale]);

  return (
    <LayoutDataContext.Provider value={{ headerData, footerData, loading, error }}>
      {children}
    </LayoutDataContext.Provider>
  );
}
