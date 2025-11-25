/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CloseIcon, MenuIcon } from '@sanity/icons';
import VoicestackLogo from 'public/assets/voicestack-logo.svg';
import VoicestackLogoSm from 'public/assets/voicestack-logo-sm.svg';
import Image from 'next/image';
import Button from './Button';
import TelIcon from '../icons/TelIcon';
import useMediaQuery from '~/utils/mediaQuery';
import { getCookie, setCookie } from '~/utils/cookie';
import Head from 'next/head';
import ProgressBar from '~/utils/progressBar/progressBar';
import Anchor from './anchor';
import SparklesIconFill from '../revamp/icons/SparklesIconFill';
import PhoneIcon from '../icons/PhoneIcon';
import { useLayoutData } from '~/providers/LayoutDataProvider';
import { urlForImage } from '~/lib/sanity.image';
import RegionStrip from '../revamp/components/regionStrip';
import { formatPhoneNumberWithCountryCode } from '../utils/helper';
import { formatOrganizationSchema } from '../utils/common';
// import RegionStrip from '../revamp/components/regionStrip';

// Constants
const GEO_PATH = '/api/geo';
const REGIONS = [
  {
    flag: {
      url: 'https://cdn.sanity.io/images/76tr0pyh/production/ae5158a9a8fd8ce578ee8df1ba1ffa1bcee41b84-24x24.svg',
      title: 'US',
    },
    url: './',
    title: 'US',
    locale: 'en',
    regionName: 'USA',
  },
  {
    flag: {
      url: 'https://cdn.sanity.io/images/76tr0pyh/production/a6e6286f1884de71a5c0f801fce92438c8e30aca-24x24.svg',
      title: 'UK',
    },
    url: './en-GB',
    title: 'UK',
    locale: 'en-GB',
    regionName: 'UK',
  },
  {
    flag: {
      url: 'https://cdn.sanity.io/images/76tr0pyh/production/2aeef6cefdae34058558224d10484ea63763ef77-24x24.svg',
      title: 'AU',
    },
    url: './en-AU',
    title: 'AU',
    locale: 'en-AU',
    regionName: 'ANZ',
  },
];

type Region = typeof REGIONS[number];

const DEFAULT_DATA = {
  navigationMenu: [],
  topNavigationMenu: [],
  phoneNumber: '',
  ctabutton: 'Book Demo',
};

// Helper functions
const getGeoData = async () => {
  try {
    return await (await fetch(GEO_PATH)).json();
  } catch (error) {
    console.error('Geo data fetch error:', error);
    return null;
  }
};

const getCountryCode = (country: string): string => {
  if (country === 'UM' || country === 'US') return '1';
  if (country === 'UK' || country === 'GB') return '2';
  if (country === 'AU' || country === 'NZ') return '3';
  return '4';
};

const getLocaleFromCountryCode = (code: string): string => {
  if (code === '2') return 'en-GB';
  if (code === '3') return 'en-AU';
  return 'en';
};

const getRegionFromCountryCode = (code: string): string => {
  if (code === '2') return 'UK';
  if (code === '3') return 'ANZ';
  return 'USA';
};

const getLocaleFromCountry = (country: string): string | null => {
  if (country === '1') return 'en';
  if (country === '2') return 'en-GB';
  if (country === '3') return 'en-AU';
  return null;
};

// Helper function to safely add flag=true without duplication
const getHrefWithFlag = (queryString: string): string => {
  if (!queryString) {
    return '/?flag=true';
  }
  // queryString already has '?' prefix, so extract the actual query params
  const queryParams = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const params = new URLSearchParams(queryParams);
  if (params.has('flag') && params.get('flag') === 'true') {
    return `/${queryString}`;
  }
  // Add flag=true to existing query string (queryString already has '?')
  return `/${queryString}&flag=true`;
};

// Sub-components
const RegionFlag = ({
  region,
  size = 18,
  className = '',
}: {
  region: Region;
  size?: number;
  className?: string;
}) => (
  <Image src={region.flag.url} alt={region.flag.title} title={region.flag.title} width={size} height={size} className={className} />
);

const RegionSwitcherDropdown = ({
  regions,
  currentLocale,
  queryString,
  toggleRef,
  openSwitcher,
  setOpenSwitcher,
}: {
  regions: Region[];
  currentLocale: string | null;
  queryString: string;
  toggleRef: React.RefObject<HTMLSpanElement>;
  openSwitcher: boolean;
  setOpenSwitcher: (open: boolean) => void;
}) => {
  const matchedRegion = regions.find((r) => r.locale === currentLocale);

  return (
    <div className="relative hidden lg:flex">
      <div className="flex rounded-[8px] w-full border border-gray-200">
        <span
          ref={toggleRef}
          className="select-none flex w-full items-center p-[6px] justify-between cursor-pointer text-gray-900"
          onClick={() => setOpenSwitcher(!openSwitcher)}
        >
          {matchedRegion && <RegionFlag region={matchedRegion} />}
        </span>
      </div>
      <div
        className={`py-[6px] rounded-[8px] overflow-hidden bg-white shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] absolute top-[calc(100%+4px)] left-auto w-[70px] right-0 flex-col ${
          openSwitcher ? 'flex' : 'hidden'
        }`}
      >
        {regions.map((region, index) =>
          currentLocale === region.locale ? (
            <div
              key={`${index}-${region.flag.url}`}
              className="flex bg-gray-200 gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none"
            >
              <RegionFlag region={region} />
              <span className="text-gray-900 text-xs font-medium">{region.title}</span>
            </div>
          ) : (
            <Anchor
              key={`${index}-${region.flag.url}`}
              href={getHrefWithFlag(queryString)}
              locale={region.locale}
              className="flex gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none hover:bg-gray-200 transition-all duration-300 ease-linea"
            >
              <RegionFlag region={region} />
              <span className="text-gray-900 text-xs font-medium">{region.title}</span>
            </Anchor>
          )
        )}
      </div>
    </div>
  );
};

const MobileRegionSwitcher = ({
  regions,
  currentLocale,
  queryString,
  onClose,
}: {
  regions: Region[];
  currentLocale: string | null;
  queryString: string;
  onClose: () => void;
}) => {
  return (
    <div className="bg-white flex gap-5 justify-center items-center lg:hidden">
      {regions.map((region, index) =>
        currentLocale === region.locale ? (
          <div key={`${index}-${region.flag.url}`} className="flex gap-2 items-center">
            <RegionFlag region={region} size={32} className="border-2 rounded-full border-black/20" />
          </div>
        ) : (
          <Anchor
            key={`${index}-${region.flag.url}`}
            href={getHrefWithFlag(queryString)}
            locale={region.locale}
            className="flex gap-2 items-center"
            onClick={onClose}
          >
            <RegionFlag region={region} size={32} className="border-2 rounded-full border-white" />
          </Anchor>
        )
      )}
    </div>
  );
};

const TopNavigationMenu = ({ safeData, currentLocale }: { safeData: any; currentLocale?: string | null }) => {
  const phoneNumberWithCountryCode = safeData?.phoneNumber 
    ? formatPhoneNumberWithCountryCode(safeData.phoneNumber, currentLocale)
    : '';
  
  return (
    <>
      {safeData?.phoneNumber && (
        <div className="flex items-center gap-2 text-gray-900 text-sm mr-3">
          <span>Talk to an expert</span>
          <Anchor
            href={`tel://${phoneNumberWithCountryCode}`}
            className="text-gray-900 text-sm font-semibold flex items-center gap-2 hover:text-gray-800 transition-colors"
          >
            {safeData?.phoneNumber}
          </Anchor>
        </div>
      )}

      {safeData?.topNavigationMenu && (
        <div className="flex items-center gap-3 gap-y-1 lg:gap-6 text-gray-900 text-sm flex-wrap justify-center">
          {safeData?.topNavigationMenu.map((item: any) => (
            <Anchor
              key={item._key}
              href={item.href}
              target={item.href?.includes('https') ? '_blank' : '_self'}
              className="text-gray-900 text-sm font-normal flex items-center gap-2 hover:text-gray-800 transition-colors"
            >
              {item.label}
            </Anchor>
          ))}
        </div>
      )}
    </>
  );
};

const RegionPopup = ({
  currentRegion,
  preferredLocale,
  queryString,
  regions,
  onClose,
}: {
  currentRegion: string;
  preferredLocale: string;
  queryString: string;
  regions: Region[];
  onClose: () => void;
}) => (
  <div className="fixed bg-[hsla(0,0%,9%,0.6)] h-screen w-screen z-[999] top-0 left-0 flex justify-center items-center">
    <div className="bg-white mx-auto pt-10 p-6 rounded-lg flex items-center flex-col gap-6 relative w-[310px]">
      <p className="text-center text-gray-800 font-medium text-base leading-[1.5]">
        You will be viewing VoiceStack&apos;s website for the {currentRegion} region
      </p>
      <Anchor
        className="bg-vs-blue hover:bg-vs-blue text-white border border-vs-blue px-[17px] py-[10px] rounded-[7px] font-inter text-base font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]"
        href={queryString ? `/${queryString}` : '/'}
        locale={preferredLocale}
        onClick={onClose}
      >
        <span className="text-base font-medium">Continue with VoiceStack {currentRegion}</span>
      </Anchor>
      <div className="w-full">
        <div className="mb-[6px] w-full flex justify-center relative after:content-[''] after:absolute after:left-0 after:top-1/2 after:border-b after:border-[#E5E7EB] after:right-0 after:-z-1">
          <span className="flex px-3 text-xs bg-white relative z-[1] text-gray-400">Or Go To</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          {regions
            .filter((region) => preferredLocale !== region.locale)
            .map((region, index) => (
              <Link
                key={`${index}-${region.regionName}`}
                href={queryString ? `/${queryString}` : '/'}
                locale={region.locale}
                className="flex py-[6px] px-3 rounded-[4px] text-xs font-medium text-gray-400 hover:bg-gray-100"
                onClick={onClose}
              >
                VoiceStack {region.regionName}
              </Link>
            ))}
        </div>
      </div>
    </div>
  </div>
);

const NavigationMenu = ({
  menuItems,
  onToggleMenu,
  onCloseMenu,
}: {
  menuItems: any[];
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}) => {
  const isMobile = useMediaQuery(1023);
  const [openSubmenus, setOpenSubmenus] = useState<Set<number>>(new Set());
  
  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  return (
    <nav className="flex lg:items-center flex-col lg:flex-row lg:gap-y-4 gap-x-4 lg:gap-x-2 xl:gap-x-6 w-full lg:w-auto flex-wrap">
      {menuItems.map((link: any, i: number) => {
        const isExternal = link?.href?.includes('https');
        const hasSubmenu = link?.hasSubmenu && link?.submenu?.length > 0;

        if (hasSubmenu) {
          // In mobile, add "Overview" link as first submenu item
          const submenuItems = isMobile && link.href 
            ? [{ label: 'Overview', href: link.href, description: null }, ...link.submenu]
            : link.submenu;
          
          const isSubmenuOpen = openSubmenus.has(i);

          return (
            <div key={`menu-${i}`} className="relative group cursor-pointer w-full lg:w-auto">
              <div 
                className="flex items-center gap-1 text-gray-700 xl:text-sm lg:text-xs font-medium leading-[1.15] lg:text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0 cursor-pointer"
                onClick={() => isMobile && toggleSubmenu(i)}
              >
                {isMobile ? (
                  <span>{link.label}</span>
                ) : (
                  <Link className="cursor-pointer" href={link.href}>
                    <span>{link.label}</span>
                  </Link>
                )}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform duration-200 ${isMobile ? (isSubmenuOpen ? 'rotate-180' : '') : 'group-hover:rotate-180'}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={`lg:absolute static top-full left-0 ${isMobile ? 'mt-0' : 'mt-2'} w-full lg:w-64 bg-white ${isMobile ? 'rounded-none' : 'rounded-lg'} lg:shadow-lg lg:border border-gray-200 ${isMobile ? (isSubmenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden') : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'} transition-all duration-200 z-50`}>
                <div className="py-2">
                  {submenuItems.map((subItem: any, subIndex: number) => (
                    <Anchor
                      key={`submenu-${i}-${subIndex}`}
                      href={subItem.href}
                      target={subItem.href?.includes('http') ? '_blank' : '_self'}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                      onClick={onCloseMenu}
                    >
                      <div className="font-medium">{subItem.label}</div>
                      {subItem.description && <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>}
                    </Anchor>
                  ))}
                </div>
              </div>
            </div>
          );
        }

      if (link.highlight) {
        return (
          <Anchor key={`menu-${i}`} href={link.href} className="relative group self-start">
            <span className="flex lg:my-0 my-4 items-center gap-2 text-white xl:text-sm md:text-xs text-sm py-[4px] pl-[10px] pr-4 rounded-[6px] border-2 border-white/80 bg-gradient-to-r from-[#4A3CE1] to-[#FF708C] shadow-[0_4px_4px_0_rgba(200,200,200,0.20)] justify-center">
              <SparklesIconFill className="w-4 h-4" />
              <span>{link.label}</span>
            </span>
          </Anchor>
        );
      }

      return link?.href ? (
        <Anchor
          elementId={`header-menu-${link.label}`}
          key={`${link.href}-${i}`}
          href={link.href}
          target={isExternal ? '_blank' : '_self'}
          className="text-gray-700 xl:text-sm lg:text-xs font-medium leading-[1.15] lg:text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0"
          onClick={onCloseMenu}
        >
          {link.label}
        </Anchor>
      ) : (
        <span className="text-gray-700 lg:text-sm font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0">
          {link.label}
        </span>
      );
    })}
  </nav>
  );
};

const Header = ({ data, refer = null }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [openSwitcher, setOpenSwitcher] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>('');
  const [regionSwitcher, setRegionSwitcher] = useState(false);
  const [regionSwitcherTop, setRegionSwitcherTop] = useState(false);
  const [regionSwitcherTopShow, setRegionSwitcherTopShow] = useState(true);
  const [preferredLocale, setPreferredLocale] = useState<string>('en');
  const [currentRegion, setCurrentRegion] = useState<string>('USA');
  const [showTopStrip, setShowTopStrip] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const matchedRegion = REGIONS.find((region) => region.locale === router.locale);
  const toggleRef = useRef<HTMLSpanElement>(null);
  const isMobile = useMediaQuery(767);
  const { siteSettings } = useLayoutData();

  const { query } = router;
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const queryParam = queryString ? `?${queryString}` : '';

  const country = getCookie('__vs_ver');
  const safeData = data || DEFAULT_DATA;

  // Geo location detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasCountrySet = country !== null;

    if (!hasCountrySet) {
      const handleGeoData = async () => {
        try {
          const res = await getGeoData();
          if (!res || !res.country) {
            setCookie('__vs_ver', '1');
            setCookie('__vs_pl', 'en');
            return;
          }

          const countryCodeNum = getCountryCode(res.country);
          setCountryCode(countryCodeNum);
          setCookie('__vs_ver', countryCodeNum);
        } catch (error) {
          console.error('Geo data error:', error);
        }
      };
      handleGeoData();
    } else {
      setCountryCode(country);
    }
  }, [router, country]);

  useEffect(() => {
    setPreferredLocale(getLocaleFromCountryCode(countryCode));
    setCurrentRegion(getRegionFromCountryCode(countryCode));
  }, [countryCode]);

  useEffect(() => {
    setCurrentLocale(router.locale);
  }, [router?.locale]);

  const closeMenu = () => {
    setShowMenu(false);
    document.body.classList.remove('menu-active');
  };

  const toggleMenu = () => {
    const newShowMenu = !showMenu;
    setShowMenu(newShowMenu);
    if (window.innerWidth < 1024) {
      document.body.classList.toggle('menu-active', newShowMenu);
    } else {
      document.body.classList.remove('menu-active');
    }
  };

  const handleScrollMob = () => {
    const currentScrollY = window.scrollY;
    setHeaderFixed(currentScrollY > 44);

    if (currentScrollY <= 0) {
      setShowTopStrip(true);
      setRegionSwitcherTopShow(true);
    } else if (currentScrollY < lastScrollY) {
      setShowTopStrip(true);
      setHeaderFixed(false);
    } else if (currentScrollY > lastScrollY) {
      setShowTopStrip(false);
      setRegionSwitcherTopShow(false);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target as Node)) {
        setOpenSwitcher(false);
      }
    };

    document.addEventListener('click', handleBodyClick);
    return () => document.removeEventListener('click', handleBodyClick);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollMob);
    return () => window.removeEventListener('scroll', handleScrollMob);
  });

  const closeRegionPopup = () => {
    setRegionSwitcher(false);
    setCookie('__vs_pl', router.locale ?? 'en');
  };

  const shouldRenderPopup = () => {
    // Check if flag=true is in the URL - if so, don't show popup
    if (router.query.flag === 'true') {
      return false;
    }
    const countryCd = getCookie('__vs_ver') ? getCookie('__vs_ver') : '1';
    return router.locale !== getLocaleFromCountry(country) && router.asPath === '/' && countryCd !== 'undefined';
  };

  const shouldRenderPopupTop = () => {
    // console.log(router.locale, getLocaleFromCountry(country), country, "shouldRenderPopupTop");
    return (
      !router.asPath.includes("/legal") &&
      router.locale !== getLocaleFromCountry(country) &&
      // router.locale !== getRegionFromCountryCode(countryCode) &&
      router.asPath !== '/' &&
      !router.query.flag &&
      regionSwitcherTopShow
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegionSwitcher(shouldRenderPopup());
    }, 1000);
    return () => clearTimeout(timer);
  }, [router.query.flag]);

  useEffect(() => {
    setRegionSwitcherTop(shouldRenderPopupTop());
  }, [router.query.flag]);

  const openDemoPopup = () => {
    router.push('/demo');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHash = () => {
      if (window.location.hash === '#demo') {
        openDemoPopup();
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setShowMenu(false);
      document.body.classList.remove('menu-active');
    };

    router.events?.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Parse organization schema JSON-LD
  let jsonLdData = null;
  if (siteSettings?.injectJSONld) {
    try {
      jsonLdData = JSON.parse(siteSettings.injectJSONld);
    } catch (error) {
      console.error('Error parsing injectJSONld:', error);
    }
  }
  console.log(jsonLdData, "jsonLdData");
  const SchemaData = formatOrganizationSchema(siteSettings.seoSettings);

  return (
    <>
      <Head>
        {/* <link rel="alternate" hrefLang="en-us" href="https://www.voicestack.com" />
        <link rel="alternate" hrefLang="en-gb" href="https://www.voicestack.com/en-GB" />
        <link rel="alternate" hrefLang="en-au" href="https://www.voicestack.com/en-AU" />
        <link rel="alternate" hrefLang="x-default" href="https://www.voicestack.com" /> */}
        {/* organization schema */}
        {SchemaData && (
          <>
          <meta property="og:image" content={urlForImage(siteSettings?.ogImage)} />
          <script
              type="application/ld+json"
              id="organization-schema"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(SchemaData) }}
            />
          </>
        )}
      </Head>

      <ProgressBar />

      {regionSwitcher && (
        <RegionPopup
          currentRegion={currentRegion}
          preferredLocale={preferredLocale}
          queryString={queryParam}
          regions={REGIONS}
          onClose={closeRegionPopup}
        />
      )}

      <div
        className={`${
          showTopStrip ? 'lg:translate-y-0' : 'lg:-translate-y-[42px]'
        } fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-gray-100`}
      >
        {/* top region switcher */}
        {regionSwitcherTop && (
          <RegionStrip locale={router.locale} setRegionSwitcherTop={setRegionSwitcherTop} className={`${
            showTopStrip ? 'lg:translate-y-0' : 'lg:-translate-y-[42px]'
          } fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-gray-100`}  />
        )}

        {/* Top Header Strip */}
        <div
          className={`hidden z-20 lg:flex justify-center w-full bg-gray-100 relative transition-transform duration-300 ease-in-out h-[42px]`}
        >
          
          <div className="flex justify-end w-full lg:px-12">
           
            <div className="flex justify-end items-center gap-3">
              <TopNavigationMenu safeData={safeData} currentLocale={currentLocale} />

              {REGIONS.length > 0 && (
                <RegionSwitcherDropdown
                  regions={REGIONS}
                  currentLocale={currentLocale}
                  queryString={queryParam}
                  toggleRef={toggleRef}
                  openSwitcher={openSwitcher}
                  setOpenSwitcher={setOpenSwitcher}
                />
              )}
            </div>
          </div>
        </div>

        <header className={`transition-all duration-300 ease-linear bg-[#F9F9F9]`}>
          <div className={`text-white`}>
            <div className="xl:px-12 px-4 flex gap-[10px]">
              <div
                className={`flex flex-grow gap-6 justify-between py-0 transition-all duration-300 ease-linear items-center h-[48px] lg:h-[63px]`}
              >
                <div
                  className={`flex flex-row gap-3 justify-between items-center flex-1 lg:relative transition-all duration-300 ease-in-out ${
                    headerFixed ? 'lg:my-3 my-2' : 'lg:my-3 my-2'
                  }`}
                >
                  <Anchor
                    href="/"
                    className={`flex-shrink-0 text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent font-monrope tracking-tighterText xl:mr-6 ${
                      isMobile && headerFixed && 'hidden'
                    }`}
                  >
                    <Image src={VoicestackLogo} alt="VoiceStack" title="VoiceStack" className="xl:max-w-none md:max-w-[110px] h-auto"></Image>
                  </Anchor>

                  <Anchor href="/" className={`${isMobile && headerFixed ? 'block' : 'hidden'}`}>
                    <Image src={VoicestackLogoSm} alt="VoiceStack" className="w-[26px] h-auto"></Image>
                  </Anchor>

                  <div
                    className={`lg:flex flex-col lg:flex-row lg:gap-6 justify-between lg:rounded-none items-center lg:static absolute top-[48px] left-0 right-0 pb-20 lg:pb-0 h-[calc(100vh-48px)] lg:h-auto shadow-[0px_40px_40px_0px_rgba(0,0,0,0.10)] lg:shadow-none xl:flex-grow xl:justify-start ${
                      showMenu ? 'flex' : 'hidden'
                    }`}
                  >
                    <div
                      className={`lg:flex-row h-full overflow-y-auto absolute top-0 lg:overflow-visible  right-0 px-4 pt-4 pb-8 w-full lg:w-auto lg:p-0 bg-white lg:bg-transparent left-0 lg:static flex-col gap-2 justify-between lg:items-center flex`}
                    >
                      <NavigationMenu menuItems={safeData?.navigationMenu || []} onToggleMenu={toggleMenu} onCloseMenu={closeMenu} />

                      <div className="flex flex-col gap-8 pb-8 lg:pb-0">
                        <div className="flex flex-col lg:flex-row gap-3 md:gap-5 items-center lg:hidden">
                          {/* {safeData?.phoneNumber && (
                            <div className="flex-shrink-0">
                              <Anchor
                                href={`tel:${safeData?.phoneNumber}`}
                                className="text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px] border border-gray-300"
                              >
                                
                                <PhoneIcon className="text-gray-700 w-5 h-5"/>
                                {safeData?.phoneNumber}
                              </Anchor>
                            </div>
                          )} */}
                          <Button type="primary" link="/demo">
                            <span>{safeData?.ctabutton || 'Book Free Demo'}</span>
                          </Button>
                        </div>

                        <MobileRegionSwitcher regions={REGIONS} currentLocale={currentLocale} queryString={queryParam} onClose={closeMenu} />
                        <div className="flex flex-wrap justify-center items-center gap-2 lg:hidden">
                          <TopNavigationMenu safeData={safeData} currentLocale={currentLocale} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex gap-6 items-center lg:justify-end hidden">
                  <Button type="borderless" className="w-fit text-sm font-medium" link={'/pricing'}>
                    {'Pricing'}
                  </Button>
                    <Button type="primary" link="/demo">
                      <span className="text-sm font-medium">{`Book Free Demo`}</span>
                    </Button>
                  </div>

                  <div className="flex gap-4 items-center lg:hidden">
                    <div className={`${isMobile && headerFixed ? 'block' : 'hidden'}`}>
                      <Button type="primary" className="w-fit" link="/demo">
                        <span className="text-sm font-medium">{`Book Free Demo`}</span>
                      </Button>
                    </div>

                    <div
                      onClick={toggleMenu}
                      className={`flex lg:hidden text-zinc-900 cursor-pointer items-center select-none z-20 rounded-lg lg:rounded-xl lg:py-[6px] lg:pr-[10px] lg:pl-[14px]`}
                    >
                      {showMenu ? <CloseIcon width={40} height={40} /> : <MenuIcon width={40} height={40} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
