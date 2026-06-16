import { DocumentTextIcon } from '@sanity/icons'
import siteConfig from '~/resources-config/siteConfig'
import { GetStaticPaths,GetStaticProps } from 'next'

import SanityPortableText from '~/resources/components/blockEditor/sanityBlockEditor'
import AuthorInfo from '~/resources/components/commonSections/AuthorInfo'
import Button from '~/resources/components/commonSections/Button'
import RelatedTag from '~/resources/components/commonSections/RelatedTag'
import ShareableLinks from '~/resources/components/commonSections/ShareableLinks'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import Layout from '~/resources/components/Layout'
import MainImageSection from '~/resources/components/MainImageSection'
import RelatedFeaturesSection from '~/resources/components/RelatedFeaturesSection'
import Section from '~/resources/components/Section'
import SidebarTitle from '~/resources/components/typography/SidebarTitle'
import { PressRelease } from '~/resources/interfaces/post'
import SEOHead from '~/resources/layout/SeoHead'
import { urlForImage } from '~/resources/lib/sanity.image'
import Wrapper from '~/resources/layout/Wrapper'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import {
  getCategories,
  getFooterData,
  getHomeSettings,
  getPressRelease,
  getTagRelatedContents,
  getTags,
  pressReleaseSlugsQuery,
} from '~/resources/lib/sanity.queries'
import { CustomHead, generateMetaData } from '~/resources/utils/customHead'
import { generateJSONLD } from '~/resources/utils/generateJSONLD'
import {
  buildResourcesAbsoluteUrl,
  getRedirectToHome,
  sanitizeUrl,
} from '~/resources/utils/common'

interface Props {
  locale: string
  pressRelease: PressRelease
  draftMode: boolean
  token: string
  relatedContents?: any
  tags?: any
  homeSettings?: any
  categories?: any
  footerData?: any
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()

  const locales = siteConfig.locales
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(pressReleaseSlugsQuery, { locale });
      return data as string[]; 
    })
  );

  const paths = slugs.flat().map((item:any) => ({
    params: { slug:item.slug, locale:item.locale },
  }));

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({
  draftMode = false,
  params = {},
}) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region = params.locale as string
  const pressRelease = await getPressRelease(client, params.slug as string, region);
  
  if (!pressRelease) {
    if (!draftMode) return getRedirectToHome(region);
    return { notFound: true };
  }
  const tagIds = pressRelease.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = await getTagRelatedContents(
    client,
    params.slug as string,
    tagIds,
    pressRelease.contentType,
    undefined,
    region
  )
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

  return {
    props: {
      locale: region,
      draftMode,
      token: draftMode ? readToken : '',
      pressRelease,
      relatedContents,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const PressReleasePage = ({
  locale,
  pressRelease,
  relatedContents,
  tags,
  homeSettings,
  draftMode,
  token,
  categories,
  footerData
}: Props) => {

  if(!pressRelease) return null

  const seoTitle = pressRelease.seoTitle || pressRelease.title
  const seoDescription = (pressRelease?.seoDescription && !pressRelease.seoDescription.includes('Test titlw')) 
    ? pressRelease.seoDescription 
    : pressRelease?.excerpt || ''
  const seoKeywords = pressRelease.seoKeywords || ''
  const seoRobots = pressRelease.seoRobots || 'index,follow'
  const seoCanonical = sanitizeUrl(
    pressRelease.seoCanonical ||
      buildResourcesAbsoluteUrl(
        locale,
        `${siteConfig.pageURLs.pressRelease}/${pressRelease.slug.current}`,
      ),
  )
  const jsonLD: any = generateJSONLD(pressRelease)

  return (
    <>
      <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={seoCanonical}
          jsonLD={jsonLD}
          contentType={pressRelease?.contentType}
          ogImage={pressRelease?.mainImage?._id ? urlForImage(pressRelease.mainImage._id) : undefined}
        />
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <Layout>
          <MainImageSection enableDate={true} post={pressRelease} />
          <Section className="justify-center !pt-24 !pb-12">
            <Wrapper className={'flex-col'}>
              <div className="flex md:flex-row flex-col gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px]">
                  <div className="post__content w-full ">
                    <SanityPortableText
                      content={pressRelease.body}
                      draftMode={draftMode}
                      token={token}
                    />
                  </div>
                </div>
                {/* <div className='flex-1 flex flex-col gap-12 mt-12  bg-red relative md:w-1/3 w-full'>
                <div className='sticky top-12 flex flex-col gap-12'>
                  <Toc headings={pressRelease?.headings} title="Contents" />
                  {pressRelease?.author &&
                    <div className=''>
                      <AuthorInfo  author={pressRelease?.author} />
                    </div>
                  }
                </div>
              </div> */}
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col gap-8">
                    <>
                      {pressRelease.pressReleaseUrl && (
                        <>
                          <SidebarTitle className="border-b border-zinc-200 pb-3">{`To Know More About`}</SidebarTitle>
                          <Button
                            target="_blank"
                            link={pressRelease.pressReleaseUrl}
                            className="bg-zinc-900 gap-6 py-[14px] px-7 hover:bg-zinc-800 self-start"
                          >
                            <DocumentTextIcon
                              width={24}
                              height={24}
                              className="text-white"
                            />
                            <span className="text-base font-medium">{`Read Original Article`}</span>
                          </Button>
                        </>
                      )}
                      {pressRelease?.author && (
                        <div className="">
                          <AuthorInfo author={pressRelease?.author} />
                        </div>
                      )}
                    </>
                    <ShareableLinks props={pressRelease?.title} />
                  </div>
                </div>
              </div>
              {pressRelease?.tags && <RelatedTag tags={pressRelease?.tags}/>}
            </Wrapper>
          </Section>
          {relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={pressRelease?.contentType}
              allPosts={relatedContents}
            />
          )}
        </Layout>
      </GlobalDataProvider>
    </>
  )
}

export default PressReleasePage
