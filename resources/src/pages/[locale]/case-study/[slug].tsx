import siteConfig from '~/resources-config/siteConfig'
import { GetStaticPaths,GetStaticProps } from 'next'

import SanityPortableText from '~/resources/components/blockEditor/sanityBlockEditor'
import AuthorInfo from '~/resources/components/commonSections/AuthorInfo'
import RelatedTag from '~/resources/components/commonSections/RelatedTag'
import ShareableLinks from '~/resources/components/commonSections/ShareableLinks'
import { GlobalDataProvider } from '~/resources/components/Context/GlobalDataContext'
import Layout from '~/resources/components/Layout'
import MainImageSection from '~/resources/components/MainImageSection'
import RelatedFeaturesSection from '~/resources/components/RelatedFeaturesSection'
import Section from '~/resources/components/Section'
import AsideBannerBlock from '~/resources/components/sections/asideBannerBlock'
import PracticeProfile from '~/resources/contentUtils/PracticeProfile'
import { Toc } from '~/resources/contentUtils/sanity-toc'
import { CaseStudies } from '~/resources/interfaces/post'
import SEOHead from '~/resources/layout/SeoHead'
import Wrapper from '~/resources/layout/Wrapper'
import { readToken } from '~/resources/lib/sanity.api'
import { getClient } from '~/resources/lib/sanity.client'
import { urlForImage } from '~/resources/lib/sanity.image'
import {
  caseStudySlugsQuery,
  getCaseStudy,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTagRelatedContents,
  getTags,
} from '~/resources/lib/sanity.queries'
import homeSettings from '~/resources/schemas/homeSettings'
import { CustomHead, customMetaTag, generateMetaData } from '~/resources/utils/customHead'
import { generateJSONLD } from '~/resources/utils/generateJSONLD'
import {
  buildResourcesAbsoluteUrl,
  getRedirectToHome,
  sanitizeUrl,
} from '~/resources/utils/common'

interface Props {
  locale: string
  caseStudy: CaseStudies
  draftMode: boolean
  token: string
  relatedContents: any
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(caseStudySlugsQuery, { locale });
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
  const region:any = params.locale 
  const caseStudy = await getCaseStudy(client, params.slug as string,region)
  if (!caseStudy) {
    if (!draftMode) return getRedirectToHome(region);
    return { notFound: true };
  }
  const tagIds = caseStudy.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = await getTagRelatedContents(
    client,
    params.slug as string,
    tagIds,
    caseStudy?.contentType,
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
      caseStudy,
      relatedContents,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const CaseStudyPage = ({
  locale,
  caseStudy,
  relatedContents,
  tags,
  homeSettings,
  draftMode,
  token,
  categories,
  footerData
}: Props) => {
  if (!caseStudy) {
    return null
  }

  const seoTitle = caseStudy.seoTitle || caseStudy.title
  const seoDescription = (caseStudy?.seoDescription && !caseStudy.seoDescription.includes('Test titlw')) 
    ? caseStudy.seoDescription 
    : caseStudy?.excerpt || ''
  const seoKeywords = caseStudy.seoKeywords || ''
  const seoRobots = caseStudy.seoRobots || 'index,follow'
  const seoCanonical = sanitizeUrl(
    caseStudy.seoCanonical ||
      buildResourcesAbsoluteUrl(
        locale,
        `${siteConfig.pageURLs.caseStudy}/${caseStudy.slug.current}`,
      ),
  )
  const jsonLD: any = generateJSONLD(caseStudy)

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={seoCanonical}
          jsonLD={jsonLD}
          ogImage={urlForImage(caseStudy?.mainImage?._id)}
          contentType={caseStudy?.contentType}
        />
        {/* {customMetaTag('caseStudy')} */}
        <Layout>
          <MainImageSection
            isAuthor={true}
            post={caseStudy}
            enableDate={true}
          />
          {caseStudy?.asideBookFreeDemoBanner && (
            <AsideBannerBlock contents={caseStudy} />
          )}
          <Section className="justify-center">
            <Wrapper className="flex-col">
              <CustomHead props={caseStudy} type="caseStudy" />
              <div className="flex md:flex-row flex-col gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px]">
                  <div className="post__content w-full">
                    <SanityPortableText
                      content={caseStudy.body}
                      draftMode={draftMode}
                      token={token}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col gap-8">
                    {caseStudy?.practiceName ||
                    caseStudy?.location ||
                    caseStudy?.providers ||
                    caseStudy?.headCount ||
                    caseStudy?.growingLocations ||
                    caseStudy?.facilities ? (
                      <PracticeProfile contents={caseStudy} />
                    ) : (
                      <Toc headings={caseStudy?.headings} title="Contents" />
                    )}
                    <div className="flex flex-col gap-8">
                      {caseStudy?.author && (
                        <div className="">
                          <AuthorInfo author={caseStudy?.author} />
                        </div>
                      )}
                      <ShareableLinks props={caseStudy?.title} />
                    </div>
                  </div>
                </div>
              </div>
              {caseStudy?.tags && <RelatedTag tags={caseStudy?.tags}/>}
            </Wrapper>
          </Section>
          {relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={caseStudy?.contentType}
              allPosts={relatedContents}
            />
          )}
        </Layout>
      </GlobalDataProvider>
    </>
  )
}

export default CaseStudyPage
