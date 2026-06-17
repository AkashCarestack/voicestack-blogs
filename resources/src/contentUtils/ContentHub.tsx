import { ArrowTopRightIcon } from '@sanity/icons'
import siteConfig from '~/resources-config/siteConfig'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useMemo,useState } from 'react'

import Anchor from '~/resources/components/commonSections/Anchor'
import Section from '~/resources/components/Section'
import DescriptionText from '~/resources/components/typography/DescriptionText'
import H2Large from '~/resources/components/typography/H2Large'
import Wrapper from '~/resources/layout/Wrapper'
import { generateHref } from '~/resources/utils/common'


interface ContentHubProps {
  contentCount?: Record<string, number>
  categories?: any[]
  featuredDescription?: string
}

export default function ContentHub({ contentCount, categories, featuredDescription }: ContentHubProps) {
  const [categoriesData, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isMainPage, setIsMainPage] = useState(false);
  const pathname = usePathname()
  const categoriesCopy = useMemo(() => categories && [...categories], [categories]);
  const router = useRouter();
  const { locale } = router.query;

  useEffect(() => {
    if (!categoriesCopy?.length) {
      setCategories([]);
      return;
    }

    const allTopic = { slug: `${siteConfig.categoryBaseUrls.base}`, categoryName: 'All Topics' }
    const finalCategories = [...categoriesCopy];

    if (!finalCategories.find((category) => category.categoryName === 'All Topics')) {
      finalCategories.unshift(allTopic);
    }

    setCategories(finalCategories);
  }, [categoriesCopy]);

  useEffect(() => {
    const currentCategory = categoriesData && categoriesData.find(category => pathname.includes(category?.slug?.current));
    setCurrentCategory(currentCategory);
  }, [categoriesData, pathname]);

  useEffect(() => {
    if (pathname.endsWith(`/${siteConfig.categoryBaseUrls.base}`)) {
      setIsMainPage(true);
    } else {
      setIsMainPage(false);
    }
  }, [pathname]);


  return (
    <Section
      className={`bg-white text-zinc-900 relative h-full justify-center ${
        categoriesData?.length ? '!pt-8 !pb-16' : '!py-6'
      }`}
    >
      <Wrapper className={`flex-col ${categoriesData?.length ? 'gap-12' : 'gap-3'} w-full browse-content`}>
        <div className='flex flex-col gap-3'>
          <H2Large className="text-zinc-900">{categoriesData?.length > 0 && isMainPage ? 'All Topics' : categoriesData?.length > 0 && !isMainPage ? currentCategory?.categoryName : 'Browse Content'}</H2Large>
          {(featuredDescription || currentCategory) && (
            <DescriptionText className='!text-zinc-600 md:max-w-[598px] w-full'>
              {featuredDescription || currentCategory.categoryDescription}
            </DescriptionText>
          )}
        </div>
        {categoriesData && categoriesData.length > 0 ? (
          <div className='flex flex-wrap gap-[10px] '>
            {categoriesData.map((category, index) => {
              let hrefTemplate = `/${category?.categoryName === 'All Topics'
                 ? `${siteConfig.categoryBaseUrls.base}` : category?.categoryName 
                 ? `${siteConfig.categoryBaseUrls.base}/${category?.slug?.current || ''} ` 
                 : siteConfig.categoryBaseUrls.base}`
            return (
              <Anchor
              className={`text-zinc-700 flex items-center text-sm font-normal py-2 px-3 
                rounded-full bg-zinc-100 hover:bg-zinc-200 transition-all ease-out duration-300 ${pathname.endsWith(`/${siteConfig.categoryBaseUrls.base}`) && index === 0 ? '!bg-zinc-900 !text-white' : pathname.includes(category?.slug?.current) ? '!bg-zinc-900 !text-white' : ''}`}
              href={generateHref(locale as string, hrefTemplate)}
              key={index}
              >
              {category.categoryName}
              </Anchor>
            )})}
          </div>

        ) : (
          <div className="flex-1 overflow-hidden w-full">
            <div className="flex md:gap-x-8 relative md:justify-between flex-wrap gap-6 justify-between items-center w-full">
              <div className="article-count text-zinc-600 text-sm md:text-base">
                {contentCount?.articles != null ? (
                  <span>
                    {contentCount.articles}{' '}
                    {contentCount.articles === 1 ? 'Article' : 'Articles'}
                  </span>
                ) : (
                  <span>No articles available</span>
                )}
              </div>
              <Anchor
                href={generateHref(locale as string, siteConfig.paginationBaseUrls.base)}
                className="browse-all text-[14px] group font-medium leading-[1.5] justify-center flex items-center gap-x-1 shrink-0"
              >
                <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-600 font-medium text-sm hover:text-zinc-900 inline-flex items-center gap-1">
                  Browse All
                  <ArrowTopRightIcon
                    className="group-hover:translate-y-[-2px] transition-transform duration-300"
                    height={20}
                    width={20}
                  />
                </span>
              </Anchor>
            </div>
          </div>
        )}
      </Wrapper>
    </Section>
  )
}