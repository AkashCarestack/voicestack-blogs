import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

const partnersData = [
  {
    id: 1,
    name: 'Louise Howlett',
    logo: 'https://placehold.co/150x40/transparent/333333?text=Prime+Practice', // Replace with actual logo
    image: 'https://placehold.co/200x200/e2e8f0/333333?text=Louise', // Replace with actual portrait
  },
  {
    id: 2,
    name: 'Dr Kinnar Shah',
    logo: 'https://placehold.co/150x40/transparent/333333?text=Dr+Kinnar+Shah', // Replace with actual logo
    image: 'https://placehold.co/200x200/e2e8f0/333333?text=Dr+Kinnar', // Replace with actual portrait
  },
  {
    id: 3,
    name: 'Nick Montagu',
    logo: 'https://placehold.co/150x40/transparent/333333?text=alphawhale', // Replace with actual logo
    image: 'https://placehold.co/200x200/e2e8f0/333333?text=Nick', // Replace with actual portrait
  },
]
export default function AboutCoachingPartners() {
  return (
    <Section className="md:pt-16 pt-12 bg-gray-50 ">
      <Container className="flex flex-col items-center w-full gap-16">
        <SectionHeader
          heading="About Coaching Partners"
          description="We are a team of experienced coaches who are dedicated to helping our clients achieve their goals."
        />
        <div className="p-8 flex justify-center items-center">
          {/* Main Container Card */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-t border-gray-200">
              {/* Column 1: Text Content */}
              <div className="flex flex-col justify-between py-6 px-12">
                <div>
                  <h4 className="text-base md:text-lg font-medium text-gray-950 mb-2.5">
                    Our Coaching Partners
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-[150%] mb-8">
                    Give you the how: proven communication scripts, objection
                    handling, and conversion training that help your team turn
                    every opportunity into bookings and revenue.
                  </p>
                </div>
                <div>
                  <Button type="borderlessIcon" link="/about-coaching-partners">
                    About Coaching Partners
                  </Button>
                </div>
              </div>

              {/* Columns 2, 3, 4: Partners (Mapped from data) */}
              {partnersData.map((partner) => (
                <div
                  key={partner.id}
                  className="p-8 flex flex-col items-center text-center"
                >
                  {/* Logo Area - fixed height for alignment */}
                  {/* <div
                                    className=""
                                    style={{
                                      height: `48px`,
                                      width: `${
                                        48 *
                                        logo?.secondaryLogo?.metadata
                                          ?.dimensions?.aspectRatio
                                      }px`,
                                    }}
                                  >
                                    <ImageLoader
                                      image={logo?.secondaryLogo?.url}
                                      className="w-full h-full object-cover"
                                      alt="Company Logo"
                                      imageClassName=" filter brightness-[132%] "
                                    />
                                  </div> */}
                  <div className="h-12 mb-8 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={`${partner.name}'s company logo`}
                      className="max-h-full max-w-[160px] object-contain"
                    />
                  </div>

                  {/* Circular Image */}
                  <div className="w-40 h-40 rounded-full overflow-hidden mb-6 bg-gray-200">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <span className="text-base font-bold text-gray-900">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
