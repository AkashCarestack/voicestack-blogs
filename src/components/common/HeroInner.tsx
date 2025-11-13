
import React from 'react';
import Image from 'next/image';
import Container from '../structure/Container';
import Section from '../structure/Section';
import H1 from '../typography/H1';
import HeroBg from 'public/assets/hero-bg.png';
import Button from './Button';

interface HeroInnerProps {
  data?: any;
}

const HeroInner: React.FC<HeroInnerProps> = ({ data }) => {
  if (!data) {
    return null; 
  }
  
  const { 
    heroSectionHeader, 
    heroSectionHeading, 
    heroSectionHeadingDesc
  } = data;

  return (
    <Section className="pt-md md:pt-[200px] pb-16 relative">
      <div className="absolute left-0 top-0 w-full h-full">
        <Image 
          src={HeroBg} 
          alt="hero background" 
          className="object-cover w-full h-full"
        />
      </div>
      
      <Container className="relative justify-center">
        <div className="flex flex-col items-center max-w-[621px] gap-4">
          <div className="flex py-2.5 px-[17px] justify-center items-center gap-2 rounded-full border border-white/10 bg-gray-50/5">
            <span className="flex text-white text-center text-xs font-medium leading-[120%] tracking-[0.98px] uppercase">
              {heroSectionHeader}
            </span>
          </div>
          
          <H1 className="text-center">{heroSectionHeading}</H1>
          <p className="text-white font-inter text-lg font-medium leading-[160%] text-center max-w-[600px] w-full">
            {heroSectionHeadingDesc}
          </p>
          <div className='flex justify-center md:pt-[12px] pt-[10px]'>
          <Button type='primary' link="/demo">
                  <span>Book free demo</span>
                </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroInner;