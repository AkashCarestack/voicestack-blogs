import siteConfig from '~/resources-config/siteConfig'

import { BaseUrlProvider } from '~/resources/components/Context/UrlContext'
import EventCarousel from '~/resources/components/eventCarousel'
import AllcontentSection from '~/resources/components/sections/AllcontentSection'
import FeaturedAndPopularBlogs from '~/resources/components/sections/FeaturedAndPopularBlogsSection'
import LatestBlogs from '~/resources/components/sections/LatestBlogSection'
import SliderSection from '~/resources/components/sections/SliderSection'
import TestimonialSection from '~/resources/components/sections/TestimonialSection'
import TagSelect from '~/resources/contentUtils/TagSelector'
import { Tag } from '~/resources/interfaces/post'
import { getUniqueData, getUniqueReorderedCarouselItems } from '~/resources/utils/common'

interface DynamicProps {
  children?: React.ReactNode
  body?: any
  isPage?: Boolean
  full_slug?: any
  tags?: Tag[]
  [x: string]: any
  testimonials?: any
  homeSettings?: any
  popularBlogs?: any
  FeaturedContents?: any
  webinars?: any
  ebooks?: any
}

const DynamicPages = ({
  posts,
  tags,
  testimonials,
  homeSettings,
  latestPosts,
  ebooks,
  webinars,
  eventCards,
  locale,
}: DynamicProps) => {
  const featuredBlog = homeSettings?.FeaturedBlog || posts[0]
  const customBrowseContent = homeSettings?.customBrowseContent 
  const featuredBlogs = homeSettings?.popularBlogs || []

  const featuredContents = [...featuredBlogs, ...posts].slice(0, 4)

  const featuredEvent =
    (homeSettings?.featuredEvent && [homeSettings?.featuredEvent]) || []

  const eventCardData = eventCards &&  [...featuredEvent, ...eventCards]

  const uniqueEventCards = getUniqueData(eventCardData)

  const reorderedCarouselItems = getUniqueReorderedCarouselItems(
    homeSettings,
    ebooks,
    webinars,
  )

  const testimonialList = homeSettings?.testimonial
    ? homeSettings?.testimonial
    : testimonials.slice(0, 1)

  const baseUrl = `/${siteConfig.pageURLs.home}`
  

  return (
    <>
      <BaseUrlProvider baseUrl={baseUrl}>
        <TagSelect tags={tags} tagLimit={7} />
         <EventCarousel allEventCards={uniqueEventCards} />
        <LatestBlogs contents={latestPosts} locale={locale} />
        <FeaturedAndPopularBlogs
          featuredBlog={featuredBlog}
          popularBlogs={featuredContents}
          locale={locale}
        />
        {/* <BannerSubscribeSection /> */}
        <SliderSection items={reorderedCarouselItems} locale={locale} />
        <TestimonialSection testimonials={testimonialList} />
          <AllcontentSection
            customBrowseContent={customBrowseContent}
            allContent={posts}
            itemsPerPage={siteConfig.pagination.itemsHomePage}
            redirect={true}
            locale={locale}
          />
        )
        <EventCarousel bgColor={'white'} allEventCards={uniqueEventCards} />
        {/* <ShortBannerSection /> */}
      </BaseUrlProvider>
    </>
  )
}

export default DynamicPages
