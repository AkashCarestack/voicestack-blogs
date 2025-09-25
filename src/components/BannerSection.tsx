import React, { useContext, useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import Wave from 'public/assets/wave.svg'
import Dome from 'public/assets/dome.png'
import Button from './common/Button'
import ButtonArrow from './icons/ButtonArrow'
import { PlayIcon } from 'lucide-react'
import { VideoItem, VideoModal } from './common/VideoModal'
import Image from 'next/image'
import { FormModal } from './common/FormModal'
import VideoPlayIconWhite from './icons/VideoPlayIconWhite'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import contacts from '~/migrations/contact.json'
import { useRouter } from 'next/router'

import TelIcon from '~/components/icons/TelIcon';
import MailIcon from '~/components/icons/MailIcon';

const BannerSection = ({data, refer=null, cta=false}) => {
  const { isDemoPopUpShown } = useContext(BookDemoContext);
  const [isOpen, setIsOpen] = useState(false);
  // const contactData = contacts;
  const router = useRouter();

  const [matchingContact, setMatchingContact] = useState(null);


  

  useEffect(() => {
    const contact = contacts.find(
      (contact) => contact.locale === router.locale
    );
    setMatchingContact(contact);
  }, [router.locale]);

  
  
  const [openForm, setOpenForm] = useState(false)
  const videoId = router.locale == "en" ? "3CsThXKvcvRrR3hwRsWWJY" : "Hj4GYLXARVjqQEnaejq3Bz";
  const overviewVideo:VideoItem = {
    videoPlatform: 'vidyard',
    videoId: videoId,
  }
  
  return (

    <Section className="pt-sm md:pt-lg pb-[200px] md:pb-[300px] bg-gray-900 relative scroll-smooth scroll-m-16" id="support">
      <Container>
        <div className='flex justify-center w-full'>
          <div className='flex flex-col gap-8 items-center w-full'>
            <div className='flex flex-col  items-center'>
              {data?.title && (
                <h2 className='text-gray-50 text-center font-manrope text-4xl lg:text-5xl font-bold leading-[1.1667] tracking-[-0.96px] w-full max-w-[800px] mb-4'>
                  {/* Start Your Practice Growth Journey<br/> With VoiceStack. */}
                  {data.title}
                </h2>
              )}
              {data?.description && (
                <p className='text-gray-200 text-center text-base font-normal leading-[145%] w-full max-w-[616px]'>
                  {data.description}
                </p>
              )}
            </div>
            {cta ? (

              <div className='flex gap-4 items-center flex-col md:flex-row relative z-[1]'>
                <Button type='primary'   onClick={() => {setOpenForm(true)}}>
                  <ButtonArrow></ButtonArrow>
                  <span className="text-base font-medium">{`Book free demo`}</span>
                </Button>
                <Button type='video' onClick={() => {setIsOpen(true) }}>
                  <VideoPlayIconWhite></VideoPlayIconWhite>
                  <span className="text-base font-medium">{`Watch overview`}</span>
                </Button>
              </div>
            ):(

              <div className='flex gap-4 items-center flex-col  relative z-[1]'>
                {data && (
                  <>
                  <div className='flex md:flex-row flex-col  gap-4 items-center'>
                  {data.phone && (
                      <Button type='secondary' link={`tel:${data.phone}`}>
                        <TelIcon className='w-4 h-4'/>
                        <span className="text-base font-medium">{data.phone}</span>
                      </Button>
                    )}
                    {data.phoneSecondary && (
                      <Button type='secondary' link={`tel:${data.phoneSecondary}`}>
                        <TelIcon className='w-4 h-4'/>
                        <span className="text-base font-medium">{data.phoneSecondary}</span>
                      </Button>
                    )}
                  </div>
                  <div className='flex md:flex-row flex-col gap-4 items-center'>
                  {data.email && (
                      <Button type='secondary' link={`mailto:${data.email}`}>
                        <MailIcon/>
                        <span className="text-base font-medium">{data.email}</span>
                      </Button>
                    )}
                    {data.salesEmail && (
                      <Button type='secondary' link={`mailto:${data.salesEmail}`}>
                        <MailIcon/>
                        <span className="text-base font-medium">{data.salesEmail}</span>
                      </Button>
                    )}
                  </div>
                  </>
                )}
                
              </div>
            )}


            </div>
        </div>
      </Container>
      {/* <div className='absolute h-[100px] bg-[url("../../public/assets/dome.svg")]'></div> */}
      <div className='absolute h-[80px] md:h-[205px] bg-[url(/assets/wave.svg)] w-full left-0 bottom-0 bg-cover bg-repeat-x bg-left-bottom'></div>
      <Image src={Dome} alt='dome' className='absolute left-[50%] bottom-0 -translate-x-[50%] w-[100%] max-w-[1002px]'></Image>
      <div>
        {isOpen && (
          <VideoModal
            refer={refer}
            isPopup={true}
            videoDetails={overviewVideo}
            className={`pt-9 flex items-start`}
            onClose={() => setIsOpen(false)}
            openForm ={() => setOpenForm(true)}
            hasDemoBanner = {true}
          />
        )}
      </div>
        {openForm && (
          <FormModal
            data={isDemoPopUpShown}
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
          />
        )}
    </Section>
  )
}


export default BannerSection
