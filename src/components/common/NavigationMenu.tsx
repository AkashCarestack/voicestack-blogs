import React, { useState } from 'react';
import Link from 'next/link';
import Anchor from './anchor';
import useMediaQuery from '~/utils/mediaQuery';
import SparklesIconFill from '../revamp/icons/SparklesIconFill';

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
                className="flex items-center justify-between lg:justify-start gap-1 text-gray-700 xl:text-sm lg:text-xs font-medium leading-[1.15] lg:text-center py-4 border-b border-gray-200 lg:border-0 lg:p-0 cursor-pointer"
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
                      className="block lg:px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
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

export default NavigationMenu;

