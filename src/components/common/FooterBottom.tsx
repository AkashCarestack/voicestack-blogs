import Container from '../structure/Container'
import Section from '../structure/Section'
import Button from './Button'
import FooterBottomBg from '../../../public/assets/Bg/image2.png'

export default function FooterBottom() {
  return (
    <Section id="footer" className={'bg-black text-white'}>
      <div className="flex flex-col gap-3 items-center px-6 md:px-12 w-full">
        <div
          className="flex flex-col items-center self-stretch md:pt-24 pt-16 md:pb-16 pb-8 "
          style={{
            backgroundImage: `url(${FooterBottomBg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
          }}
        >
          <div className="max-w-[722px] mx-auto text-center">
            <h3 className="font-manrope font-semibold lg:text-6xl text-3xl !leading-[113%]">
              Grow your practice with Voicestack
            </h3>
            <p className="pt-3 pb-6 text-base md:text-lg !leading-[160%]">
              Join leading Australian dental practices who never miss a patient
              call. See how VoiceStack can transform your front desk in just 15
              minutes.
            </p>

            <Button type="primary" link="/demo" className='w-fit mx-auto'>
              <span>Book Free Demo</span>
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    </Section>
  )
}
