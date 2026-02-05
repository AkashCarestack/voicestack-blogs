import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Anchor from './anchor';

// Region type definition
export type Region = {
  flag: {
    url: string;
    title: string;
  };
  url: string;
  title: string;
  locale: string;
  regionName: string;
};

// Helper function to remove slug and practiceType from query string
const removeSlugFromQuery = (queryString: string): string => {
  if (!queryString) {
    return '';
  }
  const queryParams = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const params = new URLSearchParams(queryParams);
  params.delete('slug');
  params.delete('practiceType'); // Exclude practiceType from region switcher links
  return params.toString() ? `?${params.toString()}` : '';
};

// Helper function to safely add flag=true without duplication and remove slug
const getHrefWithFlag = (queryString: string): string => {
  const cleanQueryString = removeSlugFromQuery(queryString);
  
  if (!cleanQueryString) {
    return '/?flag=true';
  }
  
  const params = new URLSearchParams(cleanQueryString.substring(1));
  if (params.has('flag') && params.get('flag') === 'true') {
    return `/${cleanQueryString}`;
  }
  // Add flag=true to existing query string
  return `/${cleanQueryString}&flag=true`;
};

// Sub-components
export const RegionFlag = ({
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

export const RegionSwitcherDropdown = ({
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

export const MobileRegionSwitcher = ({
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

export const RegionPopup = ({
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
        href={queryString ? `/${removeSlugFromQuery(queryString)}` : '/'}
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
                href={queryString ? `/${removeSlugFromQuery(queryString)}` : '/'}
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

