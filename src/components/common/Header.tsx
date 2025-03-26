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
        "url": "https://cdn.sanity.io/images/76tr0pyh/develop/b5c24305b7dedfaf1197c61f6f7a0b5fa991b48f-44x44.png",
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
  // console.log({queryString});
  

  // console.log({matchedRegion});
  const country:any = getCookie("__vs_ver");
  useEffect(() => {

    //custom geo api if middleware failed
    if (window !== undefined) {
      
      const hasCountrySet = country !== null;

      if (!hasCountrySet) {
        console.log("Not getting cc from mw");
        
        const handleGeoData = async () => {
          try {
            const res = await getGeoData();
            if (!res || !res.country) {
              console.log("No country data available.");
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
            console.error("Error fetching geo data:", error);
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
    setHeaderFixed(window.scrollY > 44);
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
  <Head>
    <link rel="alternate" hrefLang="en-us" href="https://www.voicestack.com" />
    <link rel="alternate" hrefLang="en-gb" href="https://www.voicestack.com/en-GB" />
    <link rel="alternate" hrefLang="en-au" href="https://www.voicestack.com/en-AU" />
    <link rel="alternate" hrefLang="x-default" href="https://www.voicestack.com" />
  </Head>
  
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


      <div className={`relative w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-vs-blue`}>
        <header
          className={`fixed w-full top-0 lg:top-[35px] left-0 z-20 transition-all duration-300 ease-linear ${headerFixed && '!fixed w-full lg:!top-4'}  left-0`}      >
          

          <div className={`z-20 text-white`}>
            <div className="max-w-7xl mx-auto lg:px-4 flex gap-[10px]">
              {/* <div className={`flex flex-col gap-3 justify-between py-[10px] transition-all duration-300 ease-linear relative  ${headerFixed ? '!lg:py-3' : 'lg:py-6'}`}> */}
              <div className={`flex flex-grow gap-3 justify-between py-0 transition-all duration-300 ease-linear lg:rounded-[10px] 
                bg-white shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] backdrop-blur-[12.5px] lg:pl-6 pl-3 pr-3 items-center h-[48px] lg:h-[63px]`}>
                
                <div className={`flex flex-row gap-3 justify-between items-center flex-1 
                lg:relative transition-all duration-300 ease-in-out ${headerFixed ? 'lg:my-3 my-2' : 'lg:my-3 my-2'}`}>
                  
                  {/* Logo */}
                  <Anchor href="/" className={`flex-shrink-0 text-2xl font-extrabold bg-gradient-text bg-clip-text 
                    text-transparent font-monrope tracking-tighterText ${isMobile  && headerFixed && 'hidden'}`}>
                    <Image src={VoicestackLogo} alt='VoiceStack' title='VoiceStack'></Image>
                  </Anchor>

                  {/* Logo Sm when mob scroll */}
                  <Anchor href="/" className={`${isMobile  && headerFixed ? 'block': 'hidden'}`}>
                    <Image src={VoicestackLogoSm} alt='VoiceStack' className='w-[26px] h-auto'></Image>
                  </Anchor>

                  <div className={`lg:flex flex-col lg:flex-row lg:gap-6 justify-between lg:rounded-none items-center 
                    lg:static absolute top-[44px] left-0 right-0 bg-white pb-20 lg:pb-0 
                    h-[calc(100vh-40px)] lg:h-auto shadow-[0px_40px_40px_0px_rgba(0,0,0,0.10)] lg:shadow-none
                    xl:flex-grow 
                    ${showMenu ? 'flex': 'hidden'} ${data.phoneNumber ? 'xl:justify-end xl:mr-10': 'xl:justify-center'}`}>

                    {/* nav items */}
                    <div className={`lg:flex-row top-[110px] right-0 px-4 pt-4 pb-8 w-full lg:w-auto lg:p-0 bg-white lg:bg-transparent left-0 lg:static flex-col 
                      gap-2 justify-between lg:items-center flex`}>
                      <nav className="flex flex-col lg:flex-row lg:gap-y-4 gap-x-4 xl:gap-x-8 w-full lg:w-auto flex-wrap ">
                        {data?.heroHeaderSection && data?.heroHeaderSection?.map((link:any, i:number) => {
                          // if (link?.headerMenu === "Comparison" && isUk) {
                          //   return null;
                          // }
                        
                          return (
                            <Anchor
                              elementId={`header-menu-${link.headerMenu}`}
                              key={link?.href + i}
                              href={link?.href}
                              className="text-gray-700 lg:text-sm xl:text-base font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0"
                              onClick={toggleMenu}
                            >
                              {link.headerMenu}
                            </Anchor>
                          );

                        })}
                      </nav>
                    </div>

                    <div className='flex flex-col gap-8'>

                      {/* mob cta and phone */}
                      <div className='flex flex-col md:flex-row gap-3 md:gap-5 items-center lg:hidden'>
                        {data.phoneNumber && (

                          <div className='flex-shrink-0'>
                            <Anchor href={`tel:${data?.phoneNumber}`} className='text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]  
                            border border-gray-300'><TelIcon/>{data?.phoneNumber}</Anchor>
                          </div>
                        )}
                        <Button type='primarySm'  onClick={() => {setOpenForm(true)}}>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-base font-medium">{data?.ctabutton}</span>
                        </Button>
                      </div>

                      {/* mob region switcher */}    
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

                  {/* dt cta and phone */}
                  <div className='lg:flex gap-3 items-center lg:justify-end hidden'>
                    {data.phoneNumber && (
                      <div className='flex-shrink-0'>
                        <Anchor href={`tel:${data?.phoneNumber}`} className='text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]  
                        border border-gray-300'><TelIcon/>{data?.phoneNumber}</Anchor>
                      </div>
                    )}
                    {refer == "carestack" ? (
                      <Button type='primarySm' link={`/demo?region=${router.locale}`} locale={false}  target='_blank'>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-sm font-medium">{`Book free demo`}</span>
                      </Button>
                    ):(

                      <Button type='primarySm' onClick={() => {setOpenForm(true)}}>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-sm font-medium">{`Book free demo`}</span>
                      </Button>
                    )}
                  </div>
                  <div className='flex gap-4 items-center'>
                    <div className={`${isMobile  && headerFixed ? 'block': 'hidden'}`}>
                      {refer == "carestack" ? (
                        <Button type="primaryXs" link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-sm font-medium">
                            {`Book free demo`}
                          </span>
                        </Button>
                        ):(
                        <Button type="primaryXs" onClick={() => { setOpenForm(true) }}>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-sm font-medium">{`Book free demo`}</span>
                        </Button>
                      )}
                        
                    </div>      

                    {/* menu icon */}
                    <div onClick={toggleMenu} className={`flex lg:hidden text-zinc-900 cursor-pointer items-center select-none z-20 rounded-lg lg:rounded-xl lg:py-[6px] lg:pr-[10px] lg:pl-[14px]
                      `}>
                      {/* {!showMenu && <span className='hidden lg:inline-flex text-zinc-800 text-sm'>More</span>} */}
                      {showMenu ? <CloseIcon width={40} height={40} /> : <MenuIcon width={40} height={40} />}
                    </div>
                  </div>      
                 
                </div>
              </div>

              {/* Region Switcher menu Desktop*/}
              {regions && regions.length > 0 &&(
                <div className='relative hidden lg:flex w-[86px]'>
                  <div className='flex p-[6px] rounded-[10px] bg-white w-full shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)]'>
                    <span ref={toggleRef} className='select-none flex w-full items-center gap- p-[6px] justify-between cursor-pointer text-gray-900' onClick={toggleSwitcher}>
                      {matchedRegion && (
                        <Image 
                            src={matchedRegion.flag.url} 
                            alt={matchedRegion.flag.title} 
                            title={matchedRegion.flag.title}
                            width={23}
                            height={23}
                            >
                          </Image>
                      )}
                      <div className={`${openSwitcher && '-rotate-180'} transition-transform linear duration-300`}>
                        <ChevronUp></ChevronUp>
                      </div>
                    </span>
                  </div>

                  <div className={`py-[6px] rounded-[10px] overflow-hidden bg-white  shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] absolute top-[calc(100%+4px)] left-0 right-0 flex-col ${openSwitcher ? 'flex' : 'hidden'}`}>
                    {regions.map((region:any, index:number) => {
                      return(
                        currentLocale == region.locale ? (
                          <div key={index+region.flag.url} className='flex bg-gray-200 gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none'>
                            <Image 
                              src={region.flag.url} 
                              alt={region.flag.title} 
                              title={region.flag.title}
                              width={23}
                              height={23}
                              >
                            </Image>
                            <span className='text-gray-900 text-sm font-medium'>{region.title}</span>
                          </div>
                        ):(

                        <Anchor key={index+region.flag.url} href={`/${query1}`} locale={region.locale} className='flex gap-2 items-center py-[6px] pl-[12px] border-b border-gray-200 last:border-none hover:bg-gray-200 transition-all duration-300 ease-linea'>
                          <Image 
                            src={region.flag.url} 
                            alt={region.flag.title} 
                            title={region.flag.title}
                            width={23}
                            height={23}
                            >
                          </Image>
                          <span className='text-gray-900 text-sm font-medium'>{region.title}</span>
                        </Anchor>
                        )
                      )
                    })}
                  </div>
                </div>
              )}
              {/* Region Switcher Desktop end */}
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