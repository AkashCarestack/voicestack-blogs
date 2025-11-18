import React, { useRef } from 'react';
import { PortableText } from '@portabletext/react';
import H2 from '../typography/H2';
import H3 from '../typography/H3';
import Paragraph from '../typography/Paragraph';
import ListingBlock from '../blockEditor/ListingBlock';

interface CaseStudyContentProps {
  description: any;
}

const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ description }) => {
  let page = 'case-study';
  
  const paragraphIndexRef = useRef(0);
  
  paragraphIndexRef.current = 0;
  
  const portableTextComponents: any = {
    block: {
      normal: ({ children }: any) => {
        const currentIndex = paragraphIndexRef.current++;
        const isFirstThree = currentIndex < 3;
        const marginBottom = isFirstThree ? 'mb-2' : 'md:mb-[40px] mb-[16px]';
        
        return (
          <Paragraph className={` text-base text-gray-700 font-geist font-normal tracking-normal !leading-[155%] ${marginBottom}`}>
            {children}
          </Paragraph>
        );
      },
      h2: ({ children }: any) => (
        <H2 className="md:!text-[40px] !text-[24px] text-gray-900 font-manrope font-bold md:!leading-[48px] !leading-[120%]  mb-4">
          {children}
        </H2>
      ),
      h3: ({ children }: any) => (
        <H3 className=" md:!text-2xl !text-[20px] text-[#111827] font-manrope font-bold mb-3  ">
          {children}
        </H3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl text-gray-900 font-manrope font-bold leading-[28px] mb-3">
          {children}
        </h4>
      ),
      h5: ({ children }: any) => (
        <h5 className="text-lg text-gray-900 font-manrope font-bold leading-[24px] mb-3">
          {children}
        </h5>
      ),
      h6: ({ children }: any) => (
        <h6 className="text-base text-gray-900 font-manrope font-bold leading-[20px] mb-2">
          {children}
        </h6>
      ),
      strong: ({ children }: any) => (
        <strong className="text-gray-900 font-manrope font-bold leading-[20px] mb-2">
          {children}
        </strong>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="text-2xl text-gray-900 font-manrope font-bold leading-[48px] border-l-4 border-purple-500 pl-4 my-4 italic">
          {children}
        </blockquote>

        
      ),
    },
    marks: {
      highlight: ({ children }: any) => (
        <span className="text-gray-950 font-semibold">{children}</span>
      ),
      underline: ({ children }: any) => (
        <span className="underline">{children}</span>
      ),
    },
    types: {
      listingBlock: ({ value }: any) => {
        if (!value) return null;
        return (
          <ListingBlock
            itemHeading={value.itemHeading}
            listingItem={value.listingItem}
            page={page}
          />
        );
      },
    },
  };

  if (!description || !Array.isArray(description) || description.length === 0) {
    return (
      <div className="mt-6 text-gray-500 text-sm p-4 bg-gray-50 rounded">
        <p>No description content available.</p>
        <p className="text-xs mt-2">Please add content in the Description field (blockContent) in Sanity Studio.</p>
      </div>
    );
  }

  return (
    <div className="">
      <PortableText
        value={description}
        components={portableTextComponents}
      />
    </div>
  );
};

export default CaseStudyContent;

