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
import PhoneIcon from '../icons/PhoneIcon';
import { useLayoutData } from '~/providers/LayoutDataProvider';
import { useHeaderContext } from '~/providers/HeaderContextProvider';
import { urlForImage } from '~/lib/sanity.image';
import RegionStrip from '../revamp/components/regionStrip';
import { formatOrganizationSchema, formatSoftwareSchema } from '../utils/common';
import TopNavigationMenu from './TopNavigationMenu';
import NavigationMenu from './NavigationMenu';
import { RegionFlag, RegionSwitcherDropdown, MobileRegionSwitcher, RegionPopup, type Region } from './HeaderRegionComponents';
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
  const { siteSettings,schemaData } = useLayoutData();
  const { setShowTopStrip: setContextShowTopStrip } = useHeaderContext();

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

  // Sync initial showTopStrip state to context
  useEffect(() => {
    setContextShowTopStrip(showTopStrip);
  }, [showTopStrip, setContextShowTopStrip]);

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
    setRegionSwitcherTopShow(currentScrollY < 1)

    if (currentScrollY <= 0) {
      setShowTopStrip(true);
      setContextShowTopStrip(true);
      // setRegionSwitcherTopShow(true);
    } else if (currentScrollY < lastScrollY) {
      // setShowTopStrip(true);
      setContextShowTopStrip(true);
      setHeaderFixed(false);
    } else if (currentScrollY > lastScrollY) {
      setShowTopStrip(false);
      setContextShowTopStrip(false);
      // setRegionSwitcherTopShow(false);
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
    return (
      !router.asPath.includes("/legal") &&
      router.locale !== getLocaleFromCountry(country) &&
      // router.locale !== getRegionFromCountryCode(countryCode) &&
      router.asPath !== '/' &&
      !router.query.flag
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
    console.log( schemaData);
  
  const schemaDataObject = schemaData?.schema?.reduce((acc: any, item: any) => {
    acc[item.name] = item.value;
    return acc;
  }, {});
  console.log({schemaDataObject: schemaDataObject});
  const OrganizationSchemaData = JSON.parse(schemaDataObject['OrganizationSchema']);
  const SoftwareSchemaData = JSON.parse(schemaDataObject['SoftwareApplicationSchema']);
  // Show software schema for:
  // - All /dental-phones pages but NOT comparison pages (/voicestack-vs-*)
  // - All who-we-serve/ pages but NOT the landing page (/who-we-serve) and NOT who-we-serve/why-voicestack
  const pathname = router?.pathname || '';
  const ShowSoftwareSchema =
  (pathname.startsWith('/phone-system') &&
    !pathname.includes('/voicestack-vs-')) ||

  (pathname.startsWith('/who-we-serve/') &&
    !pathname.startsWith('/who-we-serve/why-voicestack'));

// console.log('ShowSoftwareSchema', ShowSoftwareSchema);
  return (
    <>
      <Head>
        {/* <link rel="alternate" hrefLang="en-us" href="https://www.voicestack.com" />
        <link rel="alternate" hrefLang="en-gb" href="https://www.voicestack.com/en-GB" />
        <link rel="alternate" hrefLang="en-au" href="https://www.voicestack.com/en-AU" />
        <link rel="alternate" hrefLang="x-default" href="https://www.voicestack.com" /> */}
        {/* organization schema */}
        {OrganizationSchemaData && (
          <>
          <meta name="author" content="VoiceStack®"></meta>
          <meta property="og:image" content={urlForImage(siteSettings?.ogImage)} />
          <meta name="twitter:image" content={urlForImage(siteSettings?.ogImage)} />
          <script
              type="application/ld+json"
              id="organization-schema"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchemaData) }}
            />
          </>
        )}
        {SoftwareSchemaData && ShowSoftwareSchema && (
          <>
          <script
              type="application/ld+json"
              id="software-schema"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(SoftwareSchemaData) }}
            />
          </>
        )}
      </Head>

      <ProgressBar />

      {regionSwitcher && process.env.NEXT_PUBLIC_ENV  !='develop' && (
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
          showTopStrip ? 'lg:translate-y-0' :  'lg:-translate-y-[42px]'
        } fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-gray-100`}
      >
        {/* top region switcher */}
        {regionSwitcherTop && (
          <RegionStrip locale={router.locale} setRegionSwitcherTop={setRegionSwitcherTop} className={`${
            regionSwitcherTopShow ? 'lg:mt-0' : 'lg:mt-[-42px] mt-[-48px]'
          } fixed lg:static top-0 left-0 z-30 transition-all duration-300 ease-in-out w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-gray-100`}  />
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
                  {router.locale === 'en' && (
                    <Button type="borderless" className="w-fit text-sm font-medium" link={'/pricing'}>
                      {'Pricing'}
                    </Button>
                  )}
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
