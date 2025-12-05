import React from 'react';
import Anchor from './anchor';
import { formatPhoneNumberWithCountryCode } from '../utils/helper';

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

export default TopNavigationMenu;

