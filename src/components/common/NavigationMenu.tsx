import React, { useState } from 'react';
import Anchor from './anchor';
import useMediaQuery from '~/utils/mediaQuery';
import SparklesIconFill from '../revamp/icons/SparklesIconFill';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { urlForImage } from '~/lib/sanity.image';

interface NavigationMenuProps {
  menuItems: any[];
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

const NavigationMenu = ({
  menuItems,
  onToggleMenu,
  onCloseMenu,
}: NavigationMenuProps) => {
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

  const renderMenuItem = (link: any, i: number) => {
    const isExternal = link?.href?.includes('https');
    const hasSubmenu = link?.hasSubmenu && link?.submenu?.length > 0;
    // Flatten submenu groups into a single list for rendering
    const menuItemsList: any[] = [];
    if (link?.submenu && Array.isArray(link.submenu)) {
      link.submenu.forEach((group: any) => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach((item: any) => {
            menuItemsList.push({
              ...item,
              submenuHeader: group.submenuHeader,
            });
          });
        }
      });
    }

  // console.log({menuItems});
  


    if (hasSubmenu) {
      // In mobile, add "Overview" link as first submenu item only if hasSubmenu AND href exists
      const shouldShowOverview = isMobile && link.href && link.hasSubmenu;
      
      const isSubmenuOpen = openSubmenus.has(i);

      return (
        <li key={`menu-${i}`} className="relative group w-full lg:w-auto list-none">
          {isMobile ? (
            <div 
              className="flex items-center justify-between gap-1 text-gray-700 xl:text-sm lg:text-xs font-medium leading-[1.15] cursor-pointer"
              onClick={() => toggleSubmenu(i)}
            >
              <span className="flex-1 py-4 border-b border-gray-200">{link.label}</span>
              <ChevronDown 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          ) : (
            <div 
              className="flex items-center justify-between lg:justify-start gap-1 text-gray-700 xl:text-sm lg:text-xs font-medium leading-[1.15] lg:text-center cursor-pointer"
            >
              <Anchor className="cursor-pointer lg:p-0 block" href={link.href}>
                <span>{link.label}</span>
              </Anchor>
              <ChevronDown 
                className="w-4 h-4 text-gray-500 transition-transform duration-200 lg:rotate-0 lg:group-hover:rotate-180"
              />
            </div>
          )}
          
          {/* Desktop: Split layout with left (items grouped by header) and right (special menu) */}
          {!isMobile && (
            <div className="lg:absolute static top-full left-0 mt-2 w-full lg:w-auto bg-white rounded-[16px] shadow-2xl border  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex flex-row">
                {/* Left Side: Items grouped by submenuHeader */}
                <div className="flex flex-col lg:flex-row">
                  {link?.submenu && Array.isArray(link.submenu) && link.submenu.map((group: any, groupIndex: number) => (
                    <div key={`group-${i}-${groupIndex}`} className={'min-w-[250px] p-[26px]'}>
                      {group.submenuHeader && (
                        <div className="text-base font-medium text-gray-950 mb-2 cursor-default">
                          {group.submenuHeader}
                        </div>
                      )}
                      <ul className="flex flex-col gap-1 list-none m-0 p-0">
                        {group.items && Array.isArray(group.items) && group.items.map((subItem: any, subIndex: number) => (
                          <li key={`submenu-${i}-${groupIndex}-${subIndex}`} className="list-none">
                            <Anchor
                              href={subItem.href}
                              target={subItem.href?.includes('http') ? '_blank' : '_self'}
                              className="block py-[6px] px-2 text-sm text-zinc-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                              onClick={onCloseMenu}
                            >
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                              )}
                            </Anchor>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                 
                </div>

                {/* Right Side: Special Menu */}
                {link.specialMenu && link.specialMenu.length > 0 && (
                  <div className="flex border-l border-gray-200 min-w-[256px] p-2">
                    <div className="flex flex-col gap-4 rounded-[10px] bg-[linear-gradient(180deg,_#EACCFF_0.03%,_#FFECFA_62.74%)] w-full">
                      {link.specialMenu.map((specialItem: any, specialIndex: number) => {
                        // const imageUrl = urlForImage(specialItem.image);
                        const imageUrl = specialItem.image?.asset?.url;
                        return (
                          <Anchor
                            key={`special-${i}-${specialIndex}`}
                            href={specialItem.link}
                            target={specialItem.link?.includes('http') ? '_blank' : '_self'}
                            className="h-full flex flex-col gap-2 group/item hover:opacity-90 transition-opacity justify-between"
                            onClick={onCloseMenu}
                          >
                           
                            <div className="flex flex-col gap-1 p-[18px]">
                              <div className="font-medium text-base text-gray-950 group-hover/item:text-gray-900">
                                {specialItem.heading}
                              </div>
                              {specialItem.description && (
                                <p className="text-sm text-gray-950 leading-[1.42]">{specialItem.description}</p>
                              )}
                              <span className="text-sm text-gray-950 hover:text-gray-900 underline decoration-dotted">Learn More</span>
                            </div>
                            
                            {imageUrl && (
                              <div className="w-full relative rounded overflow-hidden">
                                <Image
                                  src={imageUrl}
                                  alt={specialItem.heading || ''}
                                  // fill
                                  width={250}
                                  height={250}
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </Anchor>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
               {/* Bottom Custom Links - Desktop */}
               {link?.bottomCustomLinks && Array.isArray(link.bottomCustomLinks) && link.bottomCustomLinks.length > 0 && (
                  <div className="flex flex-row items-center gap-4 px-[28px] py-[10px] border-t border-gray-200">
                    {link.bottomCustomLinks.map((customLink: any, index: number) => (
                      // index === 0 &&
                      <Anchor
                        key={`custom-link-${i}-${index}`}
                        href={customLink.href}
                        target={customLink.href?.includes('http') ? '_blank' : '_self'}
                        className={`block py-[6px] px-2 text-sm text-zinc-700  hover:text-gray-900 transition-colors duration-150 ${
                          index === 1 ? 'ml-auto' : 'ml-0'
                        }`}
                        onClick={onCloseMenu}
                      >
                        {customLink.label}
                      </Anchor>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* Mobile: Column layout */}
          {isMobile && (
            <div className={`static top-full left-0 mt-0 w-full bg-white rounded-none ${isSubmenuOpen ? 'block' : 'hidden'} transition-all duration-200 z-50`}>
              {/* Overview link for mobile - only if hasSubmenu AND href exists */}
              {shouldShowOverview && (
                <ul className="list-none m-0 pt-2">
                  <li className="list-none">
                    <Anchor
                      href={link.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                      onClick={onCloseMenu}
                    >
                      <div className="font-medium">Overview</div>
                    </Anchor>
                  </li>
                </ul>
              )}
              {link?.submenu && Array.isArray(link.submenu) && link.submenu.map((group: any, groupIndex: number) => (
                <div key={`mobile-group-${i}-${groupIndex}`}>
                  {group.submenuHeader && (
                    <div className={`lg:block hidden text-base font-semibold text-gray-900 px-4 ${groupIndex > 0 || shouldShowOverview ? 'pt-4' : 'pt-3'} pb-2`}>
                      {group.submenuHeader}
                    </div>
                  )}
                  <ul className="list-none m-0 pb-2 lg:py-2">
                    {group.items && Array.isArray(group.items) && group.items.map((subItem: any, subIndex: number) => (
                      <li key={`submenu-${i}-${groupIndex}-${subIndex}`} className="list-none">
                        <Anchor
                          href={subItem.href}
                          target={subItem.href?.includes('http') ? '_blank' : '_self'}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          onClick={onCloseMenu}
                        >
                          <div className="font-medium">{subItem.label}</div>
                          {subItem.description && (
                            <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                          )}
                        </Anchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {/* Bottom Custom Links - Mobile */}
              {link?.bottomCustomLinks && Array.isArray(link.bottomCustomLinks) && link.bottomCustomLinks.length > 0 && (
                <div className="hidden lg:flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200 px-4">
                  {link.bottomCustomLinks.map((customLink: any, index: number) => (
                    <Anchor
                      key={`custom-link-mobile-${i}-${index}`}
                      href={customLink.href}
                      target={customLink.href?.includes('http') ? '_blank' : '_self'}
                      className={`text-sm text-gray-600 hover:text-gray-900 transition-colors ${
                        index === 0 ? '' : ''
                      }`}
                      onClick={onCloseMenu}
                    >
                      {customLink.label}
                    </Anchor>
                  ))}
                </div>
              )}
            </div>
          )}
        </li>
      );
    }

    if (link.highlight) {
      return (
        <li key={`menu-${i}`} className="list-none">
          {/* <Anchor href={link.href} className="relative group self-start block">
            <span className="flex lg:my-0 my-4 items-center gap-2 text-white xl:text-sm md:text-xs text-sm py-[4px] pl-[10px] pr-4 rounded-[6px] border-2 border-white/80 bg-gradient-to-r from-[#4A3CE1] to-[#FF708C] shadow-[0_4px_4px_0_rgba(200,200,200,0.20)] justify-center">
              <SparklesIconFill className="w-4 h-4" />
              <span>{link.label}</span>
            </span>
          </Anchor> */}
          <Anchor href={link.href} className="relative group self-start flex justify-center">
                  <span className="flex lg:my-0 my-4 items-center min-w-[175px] lg:min-w-0 gap-2 text-white h-[42px] lg:h-auto xl:text-sm lg:text-xs text-base py-[4px] pl-[10px] pr-4 rounded-[8px] lg:rounded-[6px] lg:border-2 border-white/80 bg-gradient-to-r from-[#4A3CE1] to-[#FF708C] shadow-[0_4px_4px_0_rgba(200,200,200,0.20)] justify-center">
                    <SparklesIconFill className="w-4 h-4" />
                    <span>{link.label}</span>
                  </span>
                </Anchor>
        </li>
      );
    }

    return (
      <li key={`${link.href}-${i}`} className="list-none">
        {link?.href ? (
          <Anchor
            elementId={`header-menu-${link.label}`}
            href={link.href}
            target={isExternal ? '_blank' : '_self'}
            className="text-gray-700 block xl:text-sm lg:text-xs font-medium leading-[1.15] lg:text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0"
            onClick={onCloseMenu}
          >
            {link.label}
          </Anchor>
        ) : (
          <span className="text-gray-700 lg:text-sm font-medium leading-[1.15] text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0">
            {link.label}
          </span>
        )}
      </li>
    );
  };

  return (
    <nav className="flex lg:items-center flex-col lg:flex-row lg:gap-y-4 gap-x-4 lg:gap-x-2 xl:gap-x-6 w-full lg:w-auto flex-wrap">
      <ul className="flex lg:items-center flex-col lg:flex-row lg:gap-y-4 gap-x-4 lg:gap-x-2 xl:gap-x-6 w-full lg:w-auto flex-wrap list-none m-0 p-0">
        {menuItems.map((link: any, i: number) => renderMenuItem(link, i))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
