import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import Head from 'next/head'
import { faqJsonLd } from '~/components/utils/jsonld'
import { useLayoutData } from '~/providers/LayoutDataProvider'
import SectionHeaderV2 from './sectionHeaderV2'
import SectionH2 from '~/components/typography/revamp/SectionH2'
export default function FaqSection({ faqItems }: any) {
  const { contactData } = useLayoutData()
  // All hooks must be called before any early returns
  const [hideCategory, setHideCategory] = useState(faqItems?.hideCategory)
  const [isOpen, setIsOpen] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categories = faqItems?.faqCategories || []
  
  // All useEffect hooks must be before early return
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._key)
    }
  }, [categories, activeCategory])

  // Initialize first question as open when category changes
  React.useEffect(() => {
    if (activeCategory) {
      const activeCategoryData = categories.find((cat: any) => cat._key === activeCategory)
      const questions = activeCategoryData?.questions || []
      if (questions.length > 0) {
        setIsOpen({ [questions[0]._key || 0]: true })
      }
    }
  }, [activeCategory, categories])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  // Compute JSON-LD data
  const jsonLd = faqJsonLd(faqItems);
  const hasQuestions = jsonLd?.mainEntity && Array.isArray(jsonLd.mainEntity) && jsonLd.mainEntity.length > 0;

  // Early return if no FAQ items (after all hooks)
  if (!faqItems || (!faqItems.faqCategories && !Array.isArray(faqItems))) {
    return null;
  }
  
  const showActiveCategory = (categoryKey: string) => {
    if (categoryKey === activeCategory) return
    setActiveCategory(categoryKey)
  }
  
  const toggleQuestion = (questionKey: string) => {
    setIsOpen(prev => {
      const isCurrentlyOpen = prev[questionKey] || false
      // If clicking on an already open question, close it (close all)
      if (isCurrentlyOpen) {
        return {}
      }
      // Otherwise, close all others and open only this one
      return { [questionKey]: true }
    })
  }
  
  const activeCategoryData = categories.find((cat: any) => cat._key === activeCategory)
  const activeQuestions = activeCategoryData?.questions || []

  // Helper function to check if a block is empty
  const isBlockEmpty = (block: any): boolean => {
    if (!block || block._type !== 'block') return true;
    if (!block.children || !Array.isArray(block.children) || block.children.length === 0) return true;
    
    // Check if any child span has non-empty text
    return !block.children.some((child: any) => {
      if (child._type === 'span' && child.text) {
        return child.text.trim().length > 0;
      }
      return false;
    });
  };

  const components: any = {
    block: {
      normal: ({ value, children }: { value: any; children: React.ReactNode }) => {
        // Check if block is empty - check both value structure and rendered content
        if (!value) {
          return null;
        }
        
        // Check value.children array for text content
        if (value.children && Array.isArray(value.children)) {
          const hasTextContent = value.children.some((child: any) => {
            // Check for span elements with text
            if (child._type === 'span' && child.text) {
              return child.text.trim().length > 0;
            }
            return false;
          });
          
          if (!hasTextContent) {
            return null;
          }
        } else if (!value.children || value.children.length === 0) {
          return null;
        }
        
        return (
          <dt className="text-gray-600 font-geist tracking-normal md:text-base text-sm leading-[145%] font-normal md:pt-4 pt-2">
            {children}
          </dt>
        );
      },
    },
    marks: {
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="">{children}</strong>
      ),
      em: ({ children }: { children: React.ReactNode }) => (
        <em className="italic">{children}</em>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc my-2 list-inside space-y-1 font-geist">{children}</ul>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal list-inside space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <li className="text-gray-600 font-normal md:text-base text-sm leading-[145%]">{children}</li>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <li className="text-gray-600 md:text-sm text-sm leading-[145%]">{children}</li>
      ),
    },
  }

  const IndicatorIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5.83325 5.83301H14.1666V14.1663"
          stroke="black"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.83325 14.1663L14.1666 5.83301"
          stroke="black"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }

  const ContactInfoItem = ({ label, email, emailTextSize = 'xl:text-base' }: { label: string; email: string; emailTextSize?: string }) => {
    return (
      <div className='flex md:flex-col flex-row gap-2 xl:px-6 px-3 xl:py-3 py-2 md:border-l border-t md:border-t-0 border-[#E5E7EB] min-w-0'>
        <p className='text-gray-600 md:text-left text-center font-normal xl:text-base text-sm leading-[145%] flex-shrink-0'>{label}:</p>
        <a href={`mailto:${email}`} className={`text-vs-blue font-medium ${emailTextSize} text-sm lg:text-xs leading-[145%] break-words min-w-0`}>{email}</a>
      </div>
    )
  }
  return (
    <>
    {hasQuestions && (
      <Head>
        <script
          key={`faqJSON-${faqItems?._uid || Date.now()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
    )}
    <Section className="py-sm md:py-md lg:py-lg bg-white">
    <Container className='flex-col gap-16'>
      <div className='flex flex-col md:gap-[45px] gap-6 font-manrope font-bold leading-[120%]'>
      <div className='flex lg:flex-row flex-col gap-8 md:justify-between justify-start items-center md:items-start'>
       <div className='flex-1 lg:max-w-[380px]'> <SectionH2 content='Frequently Asked Questions' /> </div>
        {/* <h2 className='font-manrope flex-1 max-w-[369px] md:text-5xl text-2xl md:font-semibold font-medium  leading-tight tracking-tight text-gray-950'>Frequently Asked Questions</h2> */}
        <div className='flex md:flex-row flex-col w-full flex-1 max-w-[712px] border border-[#E5E7EB] rounded-[6px] md:overflow-auto'>
        <div className='flex flex-col md:max-w-[200px] w-full bg-[#F9FAFB] xl:px-6 px-3 xl:py-3 py-2'>
            <p className="font-geist xl:text-base text-sm font-normal leading-[150%] tracking-normal text-gray-700">For further queries contact:</p>
          </div>
          <ContactInfoItem 
            label="Support" 
            email={contactData?.contactEmail || ''} 
            emailTextSize="xl:text-base"
          />
          <ContactInfoItem 
            label="Sales" 
            email={contactData?.salesEmail || ''} 
            emailTextSize="xl:text-base"
          />
        </div>
      </div>

      <div className='flex lg:flex-row flex-col md:justify-between gap-8'>
        {/* Mobile Dropdown */}
       { !hideCategory && <div className="lg:hidden w-full">
          <div className="relative dropdown-container"  onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <button
             
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-left font-medium leading-[155%] md:text-lg text-sm text-gray-950"
            >
              <span>{activeCategoryData?.categoryName || 'Select Category'}</span>
              <ChevronDown className={`w-5 h-5 text-gray-600 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg z-10 max-h-60 overflow-y-auto">
                {categories.map((category: any) => (
                  <button
                    key={category._key}
                    onClick={() => {
                      showActiveCategory(category._key)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 font-medium leading-[155%] md:text-lg text-sm first:rounded-t-[12px] last:rounded-b-[12px] hover:bg-gray-50 ${
                      activeCategory === category._key 
                        ? 'bg-gray-100 text-gray-950' 
                        : 'text-gray-500'
                    }`}
                  >
                     {category.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>}

        {/* Desktop Categories Sidebar */}
        { !hideCategory && (
        <div className="hidden lg:flex flex-col gap-1.5 flex-1 max-w-[369px]">
          {categories.map((category: any) => (
            <button 
              key={category._key}
              onClick={() => showActiveCategory(category._key)} 
              className={`group font-geist text-base leading-[150%] border-b border-b-gray-200 tracking-normal p-3 text-left transition-colors ${
                activeCategory === category._key 
                  ? 'text-gray-950 font-medium' 
                  : 'text-gray-500 hover:text-gray-950 hover:font-medium font-normal'
              }`}
            >
             <div className='flex flex-row gap-2 items-center'>
               <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-opacity ${activeCategory === category._key ? 'block' : 'hidden group-hover:block'}`}>
                 <IndicatorIcon />
               </span>
               <span className='relative inline-block'>
                 <span className='font-medium invisible' aria-hidden="true" style={{ display: 'inline-block' }}>{category.categoryName}</span>
                 <span className='absolute top-0 left-0'>{category.categoryName}</span>
               </span>
             </div>
            </button>
          ))}
        </div>)}

        {/* Questions and Answers */}
        {/* <div className='flex-1'> */}
          {activeQuestions.length > 0 ? (
            <div className={`gap-6 flex flex-col flex-1 ${hideCategory ? '' : 'lg:max-w-[712px]'}`}>
              {activeQuestions.map((question: any, index: number) => {
                const questionKey = question._key || index
                const isQuestionOpen = isOpen[questionKey] || false
                
                return (
                  <div 
                  onClick={() => toggleQuestion(questionKey)}
                    key={questionKey} 
                    className={`cursor-pointer border md:rounded-[16px] rounded-[8px] md:p-6 p-4 border-gray-200`}
                  >
                    <button
                      
                      className="w-full text-left flex items-center justify-between rounded-[16px]"
                    >
                      <dt className="font-medium font-geist tracking-normal leading-[155%] md:text-lg text-base text-gray-950 pr-4">
                        {question.question}
                      </dt>
                      <div className="flex-shrink-0">
                        {isQuestionOpen ? (
                          <Minus className="w-5 h-5 text-gray-950 rotate-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-950 rotate-0" />
                        )}
                      </div>
                    </button>
                    <div 
                      className={`font-geist overflow-hidden ${
                        isQuestionOpen 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {/* <div className="text-gray-600"> */}
                        {question.answer && Array.isArray(question.answer) ? (
                          <PortableText 
                            value={question.answer.filter((block: any) => !isBlockEmpty(block))} 
                            components={components}
                          />
                        ) : (
                         null
                        )}
                      </div>
                    </div>
                  // </div>
                )
              })}
            </div>
          ) : <></>}
        {/* </div> */}
      </div>
      </div>
    </Container>
    </Section>
    </>
  )
}
