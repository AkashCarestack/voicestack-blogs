import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import SectionHeaderV2 from './sectionHeaderV2'
import ArrowIcon from '../../icons/arrowIcon'

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
export default function AboutCoachingPartners({ data }: { data: any }) {
  console.log(data)
  return (
    <Section className="bg-[#ffffff]" border="y">
      <Container
        className="w-full pt-sm md:pt-md lg:pt-lg"
        type="V2"
        border="y-0"
      >
        <div className="flex-col relative w-full flex gap-16">
          <SectionHeaderV2
            heading={data?.heading}
            description={data?.description}
          />
          {/* Main Container Card */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  border-t border-gray-200">
              {/* Column 1: Text Content */}
              <div className="group/card flex flex-col justify-between border-r border-gray-200 py-6 px-6 md:px-12">
                <div>
                  <h4 className="text-base md:text-lg font-medium text-gray-950 mb-2.5">
                    {data?.items[0]?.heading}
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-[150%] mb-8">
                    {data?.items[0]?.description}
                  </p>
                </div>
                <div>
                  <Button
                    type="borderlessIcon"
                    link={data?.items[0]?.link?.url}
                  >
                    {data?.items[0]?.link?.text}
                    <ArrowIcon className="size-4 text-codgray-950 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Columns 2, 3, 4: Partners (Mapped from data) */}
              {data?.items?.slice(1).map((item: any) => (
                <div
                  key={item._key}
                  className="group relative flex flex-col items-center text-center border-r border-gray-200 last:border-r-0 w-full h-full overflow-hidden"
                >
                  <div
                    className="flex flex-col items-center justify-center w-full overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(60, 137, 225, 0) 0%, rgba(60, 137, 225, 0.1) 100%), #F9FAFB',
                    }}
                  >
                    <div
                      className="pt-3 md:pt-6 pb-3"
                      style={{
                        height: `70px`,
                        width: `${
                          70 * item?.icon?.metadata?.dimensions?.aspectRatio
                        }px`,
                      }}
                    >
                      <ImageLoader
                        image={item?.icon?.url}
                        className="w-full h-full object-cover"
                        alt="Company Logo"
                      />
                    </div>

                    <div
                      className="w-full h-full pt-3 md:pt-5"
                      style={{
                        height: `330px`,
                      }}
                    >
                      <ImageLoader
                        image={item?.image?.url}
                        className="w-full h-full object-cover"
                        alt="Company Logo"
                      />
                    </div>
                  </div>
                 
                  {/* Heading - visible by default */}
                  <div className="w-full bg-codgray-50 py-3 md:py-4 border-t border-gray-200">
                    <h5 className="text-base font-medium text-black">
                      {item.heading}
                    </h5>
                  </div>
                  {/* Description - slides up from bottom on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out border-t border-gray-200">
                    <h5 className="text-base font-medium text-black mb-2">
                      {item.heading}
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
