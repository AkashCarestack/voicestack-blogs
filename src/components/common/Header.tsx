import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CloseIcon } from '@sanity/icons'
import VoicestackLogo from 'public/assets/voicestack-logo.svg';
import { MenuIcon } from '@sanity/icons';
import Image from 'next/image';
import ButtonArrow from '../icons/ButtonArrow';
import Button from './Button';
import TelIcon from '../icons/TelIcon';
import { FormModal } from './FormModal';



const Header = ({data}) => {

  const [showMenu, setShowMenu] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [isUk, setIsUk] = useState(false);
  const [openForm, setOpenForm] = useState(false)

  const router = useRouter();
  useEffect(()=>{
    setIsUk(router?.locale =='en-GB' ? true : false)
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


  useEffect(() => {
    window.addEventListener("scroll", handleScrollMob);
    return () => {
      window.removeEventListener("scroll", handleScrollMob);
    }
  });

  const before = "before:content-[''] before:h-[100px] before:absolute before:left-0 before:right-0 before:top-full before:bg-zinc-900";
  return (
    <>
      {/* {showMenu && <div className='fixed top-0 w-full h-full z-[19] bg-zinc-900'></div>} */}
      <div className={`relative w-full before:content-[''] before:-z-0 before:h-[100px] before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-vs-blue`}>
        <header
          className={`fixed w-full top-4 lg:top-[35px] left-0 z-20 transition-all duration-300 ease-linear ${headerFixed && '!fixed w-full !top-4'}  left-0`}      >
          

          <div className={`z-20 text-white`}>
            <div className="max-w-7xl mx-auto px-4">
              {/* <div className={`flex flex-col gap-3 justify-between py-[10px] transition-all duration-300 ease-linear relative  ${headerFixed ? '!lg:py-3' : 'lg:py-6'}`}> */}
              <div className={`flex gap-3 justify-between py-0 transition-all duration-300 ease-linear rounded-sm lg:rounded-[10px] 
                bg-white shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] backdrop-blur-[12.5px] lg:pl-6 pl-3 pr-3 items-center h-[48px] lg:h-[63px]`}>
                
                <div className={`flex flex-row gap-3 justify-between items-center flex-1 
                lg:relative transition-all duration-300 ease-in-out ${headerFixed ? 'lg:my-3 my-2' : 'lg:my-3 my-2'}`}>
                  
                  {/* Logo */}
                  <Link href="/" className="xl:flex-1 flex-shrink-0 text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent font-monrope tracking-tighterText">
                    <Image src={VoicestackLogo} alt='VoiceStack'></Image>
                  </Link>

                  <div className={`lg:flex flex-col lg:flex-row lg:gap-6 justify-between rounded-[4px] lg:rounded-none items-center 
                    lg:static absolute top-[45px] left-0 right-0 bg-white pb-12 lg:pb-0 
                    h-[calc(100vh-77px)] lg:h-auto shadow-[0px_40px_40px_0px_rgba(0,0,0,0.10)] lg:shadow-none
                    ${showMenu ? 'flex': 'hidden'}`}>

                    {/* nav items */}
                    <div className={`lg:flex-row top-[110px] right-0 px-4 pt-4 pb-8 lg:p-0 bg-white lg:bg-transparent left-0 lg:static flex-col 
                      gap-2 justify-between items-center flex`}>
                      <nav className="flex flex-col lg:flex-row gap-y-4 gap-x-4 lg:gap-x-8 flex-wrap ">
                        {data?.heroHeaderSection && data?.heroHeaderSection?.map((link:any, i:number) => {
                          // if (link?.headerMenu === "Comparison" && isUk) {
                          //   return null;
                          // }
                        
                          return (
                            <Link
                              key={link?.href + i}
                              href={link?.href}
                              className="text-gray-700 text-base font-medium leading-[1.15] text-center"
                              onClick={toggleMenu}
                            >
                              {link.headerMenu}
                            </Link>
                          );

                        })}
                      </nav>
                    </div>

                    {/* mob cta and phone */}
                    <div className='flex flex-col md:flex-row gap-3 md:gap-5 items-center lg:hidden'>
                      <div className='flex-shrink-0'>
                        <a href="tel:+(407) 833-6123" className='text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]  
                        border border-gray-300'><TelIcon/>{data?.phoneNumber}</a>
                      </div>
                      <Button type='primarySm'  onClick={() => {setOpenForm(true)}}>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-base font-medium">{data?.ctabutton}</span>
                      </Button>
                    </div>
                  </div>

                  {/* dt cta and phone */}
                  <div className='lg:flex gap-3 items-center xl:flex-1 lg:justify-end hidden'>
                    <div className='flex-shrink-0'>
                      <a href="tel:+(407) 833-6123" className='text-gray-700 px-[12px] py-[7px] rounded-[7px] text-sm font-medium leading-6 flex items-center whitespace-nowrap gap-[8px]  
                      border border-gray-300'><TelIcon/>{data?.phoneNumber}</a>
                    </div>
                    <Button type='primarySm' onClick={() => {setOpenForm(true)}}>
                      <ButtonArrow></ButtonArrow>
                      <span className="text-sm font-medium">{`Book free demo`}</span>
                    </Button>
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
          </div>
        </header>
      </div>
      {openForm && (
        <FormModal
          className={`pt-9  flex items-start`}
          onClose={() => setOpenForm(false)}
        />
      )}
    </>

  );
};

export default Header;