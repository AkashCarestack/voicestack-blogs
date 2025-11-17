import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getClient } from '~/lib/sanity.client';
import { getHeaderData, getFooterData, getALLSiteSettings, getContactData } from '~/lib/sanity.queries';

interface LayoutDataContextType {
  headerData: any;
  footerData: any;
  siteSettings: any;
  contactData: any;
  loading: boolean;
  error: string | null;
}

const LayoutDataContext = createContext<LayoutDataContextType>({
  headerData: null,
  footerData: null,
  siteSettings: null,
  contactData: null,
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
  const [siteSettings, setSiteSettings] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const region = router.locale || 'en';
        const client = getClient();
        
        const [header, footer, siteSettingsData, contactData] = await Promise.all([
          getHeaderData(client, region),
          getFooterData(client, region),
          client.fetch(getALLSiteSettings(region)),
          getContactData(client, region)
        ]);
        
        setHeaderData(header);
        setFooterData(footer);
        setSiteSettings(siteSettingsData);
        setContactData(contactData);
        setError(null);
      } catch (error) {
        console.error('Error fetching layout data:', error);
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
        setSiteSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
  }, [router.locale]);

  return (
    <LayoutDataContext.Provider value={{ headerData, footerData, siteSettings, contactData, loading, error }}>
      {children}
    </LayoutDataContext.Provider>
  );
}
