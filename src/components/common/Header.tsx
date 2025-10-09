/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CloseIcon } from '@sanity/icons'
import VoicestackLogo from 'public/assets/voicestack-logo.svg';
import VoicestackLogoSm from 'public/assets/voicestack-logo-sm.svg';
import { MenuIcon } from '@sanity/icons';
import Image from 'next/image';
import ButtonArrow from '../icons/ButtonArrow';
import Button from './Button';
import TelIcon from '../icons/TelIcon';
import { FormModal } from './FormModal';
import ChevronUp from '../icons/ChevronDown';
import Script from 'next/script';
import useMediaQuery from '~/utils/mediaQuery';
import { BookDemoContext } from '~/providers/BookDemoProvider';
import { eraseCookie, getCookie, setCookie } from '~/utils/cookie';
import Dropdown from './Dropdown';
import Head from 'next/head';
import ProgressBar from '~/utils/progressBar/progressBar'
import Tracker from './trackerComponent';
import Anchor from './anchor';
import SparklesIconFill from '../revamp/icons/SparklesIconFill';



const Header = ({ data, refer=null }) => {

  const [showMenu, setShowMenu] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [restrictTopSwitcher, setRestrictTopSwitcher] = useState(false);
  const [openSwitcher, setOpenSwitcher] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(null);
  const { isDemoPopUpShown } = useContext(BookDemoContext);
  const [countryCode, setCountryCode] = useState<any>();
  const [regionSwitcher, setRegionSwitcher] = useState(false);
  const [regionSwitcherTop, setRegionSwitcherTop] = useState(false);
  const [localeCountry, setLocaleCountry] = useState<any>(null);
  const [_preferredLocale, setPreferredLocale] = useState<any>(null);
  const [currentRegion, setCurrentRegion] = useState<any>(null);
  const [showTopStrip, setShowTopStrip] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const geoPath ="/api/geo";
  const preLocale = getCookie("__vs_pl");
  
  const regions = [
    {
      "flag": {
        "url": "https://cdn.sanity.io/images/76tr0pyh/production/ae5158a9a8fd8ce578ee8df1ba1ffa1bcee41b84-24x24.svg",
        "title": "US"
      },
      "url": "./",
      "title": "US",
      "locale": "en",
      "regionName": "USA"
    },
    {
      "flag": {
        "url": "https://cdn.sanity.io/images/76tr0pyh/production/a6e6286f1884de71a5c0f801fce92438c8e30aca-24x24.svg",
        "title": "UK"
      },
      "url": "./en-GB",
      "title": "UK",
      "locale": "en-GB",
      "regionName": "UK"
    },
    {
      "flag": {
        "url": "https://cdn.sanity.io/images/76tr0pyh/production/2aeef6cefdae34058558224d10484ea63763ef77-24x24.svg",
        "title": "AU"
      },
      "url": "./en-AU",
      "title": "AU",
      "locale": "en-AU",
      "regionName": "ANZ"
    }
    
  ]

  const getGeoData = async () => {
    try {
      return (await (await fetch(geoPath)).json())
    } catch (error) {
      console.log(error);
    }
  }

  const router = useRouter();
  const matchedRegion = regions.find((region) => region.locale === router.locale);
  const toggleRef = useRef(null);
  const isMobile = useMediaQuery(767);

  const { query } = router;

  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  const query1 = queryString ? `?${queryString}` : "";

  


  const country:any = getCookie("__vs_ver");
  useEffect(() => {

    //custom geo api if middleware failed
    if (window !== undefined) {
      
      const hasCountrySet = country !== null;

      if (!hasCountrySet) {

        
        const handleGeoData = async () => {
          try {
            const res = await getGeoData();
            if (!res || !res.country) {

              setCookie("__vs_ver", "1");
              setCookie("__vs_pl", "en");
              return;
            }
        
            // Determine countrycode based on the country
            const countryCodeNum:any =
            res.country === "UM" || res.country === "US" ? 1 : res.country === "UK" || res.country === "GB" ? 2 : res.country === "AU"  || res.country === "NZ" ? 3 : 4;
                
            // Set the country code state and cookie
            setCountryCode(countryCodeNum);
            setCookie("__vs_ver", countryCodeNum);
            
          } catch (error) {
            console.log(error);
          }
        };
        
        // Call the function
        handleGeoData();
      } 
      else {
        setCountryCode(country);
      }
    }

  }, [router, country])

  useEffect(()=>{
    setPreferredLocale(countryCode === "2" ? "en-GB": countryCode === "3" ? "en-AU" : "en");
    setCurrentRegion(countryCode === "2" ? "UK": countryCode === "3" ? "ANZ" : "USA");
  },[countryCode])

  useEffect(()=>{
    setCurrentLocale(router.locale);   
  },[router?.locale])
 
  const closeMenu = () => {
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (window.innerWidth < 1024 && showMenu == true) {
      document.body.classList.add("menu-active");
    } else {
      document.body.classList.remove("menu-active");
    }
  }

  const handleScrollMob = () => {
    const currentScrollY = window.scrollY;
    setHeaderFixed(currentScrollY > 44);
    
    // Show top strip when at top or scrolling up, hide when scrolling down
    if (currentScrollY <= 0) {
      setShowTopStrip(true);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      setShowTopStrip(true);
      setHeaderFixed(false);
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down
      setShowTopStrip(false);
    }
    
    setLastScrollY(currentScrollY);
  };

  // const isMobile: any = useMediaQuery(1024);
  const toggleSwitcher = () => {
    setOpenSwitcher(!openSwitcher)
  }

  useEffect(() => {
    const handleBodyClick = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setOpenSwitcher(false);
      }
    };

    document.addEventListener("click", handleBodyClick);

    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollMob);
    return () => {
      window.removeEventListener("scroll", handleScrollMob);
    }
  });

  const closeRegionPopup = () =>{
    setRegionSwitcher(false);
    setRegionSwitcherTop(false);
    setCookie('__vs_pl', router.locale ?? "en")
  }

  const getRegionLocale = () => {
    return country === "1" ? "en"
    : country === "2" ? "en-GB"
    : country === "3" ? "en-AU"
    : null;
  }
  
  function shouldRenderPopup() {
    
    const countryCd:any = getCookie("__cs_ver") ? getCookie("__cs_ver") : 1;
    return (
      // preLocale == null &&
      router.locale !== getRegionLocale() &&
      router.asPath === '/' &&
      countryCd != "undefined" 
    );
  }

 
  // useEffect(()=>{
  //   //for showing region main popup
  //   const timer2 = setTimeout(() => {
  //     setRegionSwitcher(shouldRenderPopup)
  //   }, 500); 

  //   return () => clearTimeout(timer2); 
  // },[])

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegionSwitcher(shouldRenderPopup)
    }, 1000);
    return () => clearTimeout(timer);
  }, [])

  useEffect(()=>{

    //for localeCountry
    setLocaleCountry(
      router.locale == "en" ? "USA" : 
      router.locale == "en-GB" ? "UK" : 
      router.locale == "en-AU" ? "ANZ" : undefined
    );
  },[router])

  const openDemoPopup = () => {
    setOpenForm(true);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHash = () => {
      if (window.location.hash === "#demo") {
        openDemoPopup();
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  // Add fallback data if data is null
  const safeData = data || {
    navigationMenu: [],
    topNavigationMenu: [],
    phoneNumber: '',
    ctabutton: 'Book Demo'
  };
  
  

  const btnClass = "bg-vs-blue hover:bg-vs-blue text-white border border-vs-blue px-[17px] py-[10px] rounded-[7px] text-gray-900 font-inter text-base font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]";
  return (
    <>
      <Head>
        <link rel="alternate" hrefLang="en-us" href="https://www.voicestack.com" />
        <link rel="alternate" hrefLang="en-gb" href="https://www.voicestack.com/en-GB" />
        <link rel="alternate" hrefLang="en-au" href="https://www.voicestack.com/en-AU" />
        <link rel="alternate" hrefLang="x-default" href="https://www.voicestack.com" />
      </Head>
      
      <ProgressBar/>
    {/* region popup main */}
    {regionSwitcher &&  
      <div className="fixed bg-[hsla(0,0%,9%,0.6)] h-screen w-screen z-[999] flex justify-center items-center">
        <div className="bg-white mx-auto pt-10 p-6 rounded-lg flex items-center flex-col gap-6 relative w-[310px]">
          {/* <svg  onClick={closeRegionPopup} className='absolute right-3 top-3 cursor-pointer' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.27918 5.21985C6.137 5.08737 5.94896 5.01524 5.75465 5.01867C5.56035 5.0221 5.37497 5.10081 5.23755 5.23822C5.10014 5.37564 5.02143 5.56102 5.018 5.75532C5.01457 5.94963 5.0867 6.13767 5.21918 6.27985L8.93918 9.99985L5.21918 13.7198C5.14549 13.7885 5.08639 13.8713 5.0454 13.9633C5.0044 14.0553 4.98236 14.1546 4.98059 14.2553C4.97881 14.356 4.99733 14.4561 5.03505 14.5494C5.07278 14.6428 5.12892 14.7277 5.20014 14.7989C5.27136 14.8701 5.35619 14.9262 5.44958 14.964C5.54297 15.0017 5.643 15.0202 5.7437 15.0184C5.8444 15.0167 5.94372 14.9946 6.03571 14.9536C6.12771 14.9126 6.21052 14.8535 6.27918 14.7798L9.99918 11.0598L13.7192 14.7798C13.7878 14.8535 13.8706 14.9126 13.9626 14.9536C14.0546 14.9946 14.154 15.0167 14.2547 15.0184C14.3554 15.0202 14.4554 15.0017 14.5488 14.964C14.6422 14.9262 14.727 14.8701 14.7982 14.7989C14.8694 14.7277 14.9256 14.6428 14.9633 14.5494C15.001 14.4561 15.0195 14.356 15.0178 14.2553C15.016 14.1546 14.9939 14.0553 14.953 13.9633C14.912 13.8713 14.8529 13.7885 14.7792 13.7198L11.0592 9.99985L14.7792 6.27985C14.9117 6.13767 14.9838 5.94963 14.9804 5.75532C14.9769 5.56102 14.8982 5.37564 14.7608 5.23822C14.6234 5.10081 14.438 5.0221 14.2437 5.01867C14.0494 5.01524 13.8614 5.08737 13.7192 5.21985L9.99918 8.93985L6.27918 5.21985Z" fill="black"/>
          </svg> */}

          <p className='text-center text-gray-800 font-medium text-base leading-[1.5]'>You will be viewing VoiceStack&apos;s website for the {currentRegion} region</p>

          <Anchor className={`${btnClass}`} href={`/${query1}`} locale={_preferredLocale} onClick={closeRegionPopup}>
            <span className="text-base font-medium">
              Continue with VoiceStack {currentRegion}
            </span>
          </Anchor>
          

          <div className='w-full'>
            <div className="mb-[6px] w-full flex justify-center relative after:content-[''] after:absolute after:left-0 after:top-1/2 after:border-b after:border-[#E5E7EB] after:right-0 after:-z-1">
              <span className='flex px-3 text-xs bg-white relative z-[1] text-gray-400'>Or Go To</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              {regions.map((region:any, index:number) => {
                return(
                  _preferredLocale !== region.locale && (
                    <Link key={index+region?.regionName} href={`/${query1}`} locale={region.locale} className='flex  py-[6px] px-3 rounded-[4px] text-xs font-medium text-gray-400 hover:bg-gray-100'
                    onClick={closeRegionPopup}>VoiceStack {region.regionName}
                    </Link>
                  )
                )
              })}
            </div>
          </div>
        </div>
      </div>
    }
      {/* region popup main end*/}


      <div className={` ${showTopStrip ? 'lg:translate-y-0' : 'lg:-translate-y-[42px]'} fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-gray-100`}>
        
        {/* Top Header Strip - Phone Number & Region Switcher */}
        <div className={`hidden z-20 lg:flex justify-center w-full bg-gray-100 relative transition-transform duration-300 ease-in-out h-[42px]`}>
          <div className="flex justify-end w-full lg:px-12">
            <div className="flex justify-end items-center gap-3">
              {/* Phone Number */}
              {safeData?.phoneNumber && (
                <div className='flex items-center gap-2 text-gray-900 text-sm mr-3'>
                  <span>Talk to an expert</span>
                  <Anchor 
                    href={`tel:${safeData?.phoneNumber}`} 
                    className='text-gray-900 text-sm font-semibold flex items-center gap-2 hover:text-gray-800 transition-colors'
                  >
                    {/* <TelIcon className="w-4 h-4" /> */}
                    {safeData?.phoneNumber}
                  </Anchor>
                </div>
              )}

              {/* top */}
              {safeData?.topNavigationMenu && (
                <div className='flex items-center gap-6 text-gray-900 text-sm'>
                  {safeData?.topNavigationMenu.map((item: any) => (
                    <Anchor key={item._key} href={item.href} className='text-gray-900 text-sm font-normal flex items-center gap-2 hover:text-gray-800 transition-colors'>{item.label}</Anchor>
                  ))}
                </div>
              )}
              
              {/* Region Switcher top strip */}
              {regions && regions.length > 0 &&(
                <div className='relative hidden lg:flex'>
                  <div className='flex rounded-[8px] w-full border border-gray-200'>
                    <span ref={toggleRef} className='select-none flex w-full items-center p-[6px] justify-between cursor-pointer text-gray-900' onClick={toggleSwitcher}>
                      {matchedRegion && (
                        <Image 
                            src={matchedRegion.flag.url} 
                            alt={matchedRegion.flag.title} 
                            title={matchedRegion.flag.title}
                            width={18}
                            height={18}
                            >
                          </Image>
                      )}
                      {/* <div className={`${openSwitcher && '-rotate-180'} transition-transform linear duration-300`}>
                        <ChevronUp></ChevronUp>
                      </div> */}
                    </span>
                  </div>

                  <div className={`py-[6px] rounded-[8px] overflow-hidden bg-white  shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] absolute top-[calc(100%+4px)] left-auto w-[70px] right-0 flex-col ${openSwitcher ? 'flex' : 'hidden'}`}>
                    {regions.map((region:any, index:number) => {
                      return(
                        currentLocale == region.locale ? (
                          <div key={index+region.flag.url} className='flex bg-gray-200 gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none'>
                            <Image 
                              src={region.flag.url} 
                              alt={region.flag.title} 
                              title={region.flag.title}
                              width={18}
                              height={18}
                              >
                            </Image>
                            <span className='text-gray-900 text-xs font-medium'>{region.title}</span>
                          </div>
                        ):(

                        <Anchor key={index+region.flag.url} href={`/${query1}`} locale={region.locale} className='flex gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none hover:bg-gray-200 transition-all duration-300 ease-linea'>
                          <Image 
                            src={region.flag.url} 
                            alt={region.flag.title} 
                            title={region.flag.title}
                            width={18}
                            height={18}
                            >
                          </Image>
                          <span className='text-gray-900 text-xs font-medium'>{region.title}</span>
                        </Anchor>
                        )
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <header
          className={`transition-all duration-300 ease-linear bg-[#F9F9F9]`}  >
          <div className={` text-white`}>
            <div className="lg:px-12 px-4 flex gap-[10px]">
              <div className={`flex flex-grow gap-6 justify-between py-0 transition-all duration-300 ease-linear 
               items-center h-[48px] lg:h-[63px]`}>
                
                <div className={`flex flex-row gap-3 justify-between items-center flex-1 
                lg:relative transition-all duration-300 ease-in-out ${headerFixed ? 'lg:my-3 my-2' : 'lg:my-3 my-2'}`}>
                  
                  <Anchor href="/" className={`flex-shrink-0 text-2xl font-extrabold bg-gradient-text bg-clip-text 
                    text-transparent font-monrope tracking-tighterText mr-6 ${isMobile  && headerFixed && 'hidden'}`}>
                    <Image src={VoicestackLogo} alt='VoiceStack' title='VoiceStack'></Image>
                  </Anchor>

                  <Anchor href="/" className={`${isMobile  && headerFixed ? 'block': 'hidden'}`}>
                    <Image src={VoicestackLogoSm} alt='VoiceStack' className='w-[26px] h-auto'></Image>
                  </Anchor>

                  <div className={`lg:flex flex-col lg:flex-row lg:gap-6 justify-between lg:rounded-none items-center 
                    lg:static absolute top-[44px] left-0 right-0 pb-20 lg:pb-0 
                    h-[calc(100vh-40px)] lg:h-auto shadow-[0px_40px_40px_0px_rgba(0,0,0,0.10)] lg:shadow-none
                    xl:flex-grow xl:justify-start ${showMenu ? 'flex': 'hidden'}`}>

                    <div className={`lg:flex-row top-[110px] right-0 px-4 pt-4 pb-8 w-full lg:w-auto lg:p-0 bg-white lg:bg-transparent left-0 lg:static flex-col 
                      gap-2 justify-between lg:items-center flex`}>
                      <nav className="flex items-center flex-col lg:flex-row lg:gap-y-4 gap-x-4 xl:gap-x-6 w-full lg:w-auto flex-wrap ">
                        {safeData?.navigationMenu && safeData?.navigationMenu?.map((link:any, i:number) => {
                         
                        let isExternal = link?.href?.includes('http')
                        const hasSubmenu = link?.hasSubmenu && link?.submenu?.length > 0
                        
                        if (hasSubmenu) {
                          return (
                            <div key={`menu-${i}`} className="relative group">
                              <div className="flex items-center gap-1 text-gray-700 lg:text-sm font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0 cursor-pointer">
                                <span>{link.label}</span>
                                <svg 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  className="transition-transform duration-200 group-hover:rotate-180"
                                >
                                  <path 
                                    d="M6 9l6 6 6-6" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              
                              {/* Submenu Dropdown */}
                              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                  {link.submenu.map((subItem: any, subIndex: number) => (
                                    <Anchor
                                      key={`submenu-${i}-${subIndex}`}
                                      href={subItem.href}
                                      target={subItem.href?.includes('http') ? "_blank" : "_self"}
                                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                                      onClick={toggleMenu}
                                    >
                                      <div className="font-medium">{subItem.label}</div>
                                      {subItem.description && (
                                        <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                                      )}
                                    </Anchor>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        if (link.highlight) {
                          return (
                            <Anchor key={`menu-${i}`} href={link.href} className="relative group">
                              <span className="flex items-center gap-2 text-white text-sm py-[4px] pl-[10px] pr-4 rounded-[6px] border-2 border-white/80 bg-gradient-to-r from-[#4A3CE1] to-[#FF708C] shadow-[0_4px_4px_0_rgba(200,200,200,0.20)] justify-center">
                                <SparklesIconFill className='w-4 h-4' />
                                <span>{link.label}</span>
                              </span>
                            </Anchor>
                          )
                        }
                        
                        return (
                          isExternal ? (
                            <Anchor
                              elementId={`header-menu-${link.label}`}
                              key={link?.href + i}
                              href={link?.href}
                              target="_blank"
                              className="text-gray-700 lg:text-sm font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0"
                              onClick={toggleMenu}
                            >
                              {link.label}
                            </Anchor>
                          ) : (
                            <Anchor
                              elementId={`header-menu-${link.label}`}
                              key={link?.href + i}
                              href={link?.href}
                              target={isExternal ? "_blank" : "_self"}
                              className="text-gray-700 lg:text-sm font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0"
                              onClick={toggleMenu}
                            >
                              {link.label}
                            </Anchor>
                          )
                        )
                        })}
                      </nav>
                    </div>

                    <div className='flex flex-col gap-8'>

                      <div className='flex flex-col md:flex-row gap-3 md:gap-5 items-center lg:hidden'>
                        {safeData?.phoneNumber && (
                          <div className='flex-shrink-0'>
                            <Anchor href={`tel:${safeData?.phoneNumber}`} className='text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]  
                            border border-gray-300'><TelIcon className="text-white"/>{safeData?.phoneNumber}</Anchor>
                          </div>
                        )}
                        <Button type='primary'  onClick={() => {setOpenForm(true)}}>
                          <span>{safeData?.ctabutton}</span>
                        </Button>
                      </div>

                      <div className={`bg-white flex gap-5 justify-center items-center lg:hidden`}>
                        {regions.map((region:any, index:number) => {
                          return(
                            currentLocale == region.locale ? (
                              <div key={index + region?.flag.url} className='flex gap-2 items-center'>
                                <Image 
                                  src={region.flag.url} 
                                  alt={region.flag.title} 
                                  title={region.flag.title}
                                  width={32}
                                  height={32}
                                  className='border-2 rounded-full border-black/20'
                                  >
                                </Image>
                              </div>
                            ):(

                              <Anchor key={index + region?.flag.url} href="/" locale={region.locale} className='flex gap-2 items-center' onClick={closeMenu}>
                              <Image 
                                src={region.flag.url} 
                                alt={region.flag.title} 
                                title={region.flag.title}
                                width={32}
                                height={32}
                                className='border-2 rounded-full border-white'
                                >
                              </Image>
                            </Anchor>
                            )
                          )
                        })}
                      </div>
                    </div>

                  </div>

                  <div className='lg:flex gap-3 items-center lg:justify-end hidden'>
                    <Button type='primary' onClick={() => {setOpenForm(true)}}>
                      {/* <ButtonArrow></ButtonArrow> */}
                      <span className="text-sm font-medium">{`Book Free Demo`}</span>
                    </Button>
                  </div>
                  <div className='flex gap-4 items-center lg:hidden'>
                    <div className={`${isMobile  && headerFixed ? 'block': 'hidden'}`}>
                   
                      <Button type="primary"  className="w-fit" onClick={() => { setOpenForm(true) }}>
                        <span className="text-sm font-medium">{`Book Free Demo`}</span>
                        
                      </Button>
                        
                    </div>      

                    <div onClick={toggleMenu} className={`flex lg:hidden text-zinc-900 cursor-pointer items-center select-none z-20 rounded-lg lg:rounded-xl lg:py-[6px] lg:pr-[10px] lg:pl-[14px]
                      `}>
                      {showMenu ? <CloseIcon width={40} height={40} /> : <MenuIcon width={40} height={40} />}
                    </div>
                  </div>      
                 
                </div>
              </div>

             
            </div>
          </div>
        </header>
      </div>
      {openForm && (
        <FormModal
          className={`pt-9  flex items-start`}
          onClose={() => setOpenForm(false)}
          data={isDemoPopUpShown}
        />
      )}
    </>

  );
};

export default Header;