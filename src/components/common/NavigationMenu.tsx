import React, { useState } from 'react';
import Anchor from './anchor';
import useMediaQuery from '~/utils/mediaQuery';
import SparklesIconFill from '../revamp/icons/SparklesIconFill';
import { ChevronDown } from 'lucide-react';

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
      <ul className="flex lg:items-center flex-col lg:flex-row lg:gap-y-4 gap-x-4 lg:gap-x-2 xl:gap-x-6 w-full lg:w-auto flex-wrap list-none m-0 p-0">
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
              <li key={`menu-${i}`} className="relative group cursor-pointer w-full lg:w-auto list-none">
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
                <ul className={`lg:absolute static top-full left-0 ${isMobile ? 'mt-0' : 'mt-2'} w-full lg:w-80 bg-white ${isMobile ? 'rounded-none' : 'rounded-lg'} lg:shadow-lg lg:border border-gray-200 ${isMobile ? (isSubmenuOpen ? 'block' : 'hidden') : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'} transition-all duration-200 z-50 list-none m-0 py-2`}>
                  {submenuItems.map((subItem: any, subIndex: number) => (
                    <li key={`submenu-${i}-${subIndex}`} className="list-none">
                      <Anchor
                        href={subItem.href}
                        target={subItem.href?.includes('http') ? '_blank' : '_self'}
                        className="block lg:px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                        onClick={onCloseMenu}
                      >
                        <div className="font-medium">{subItem.label}</div>
                        {subItem.description && <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>}
                      </Anchor>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          if (link.highlight) {
            return (
              <li key={`menu-${i}`} className="list-none">
                <Anchor href={link.href} className="relative group self-start block">
                  <span className="flex lg:my-0 my-4 items-center gap-2 text-white xl:text-sm md:text-xs text-sm py-[4px] pl-[10px] pr-4 rounded-[6px] border-2 border-white/80 bg-gradient-to-r from-[#4A3CE1] to-[#FF708C] shadow-[0_4px_4px_0_rgba(200,200,200,0.20)] justify-center">
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
        })}
      </ul>
    </nav>
  );
};

export default NavigationMenu;

