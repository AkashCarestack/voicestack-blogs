import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import Head from 'next/head'
import { faqJsonLd } from '~/components/utils/jsonld'
import { useLayoutData } from '~/providers/LayoutDataProvider'
export default function FaqSection({ faqItems }: any) {
  const { contactData } = useLayoutData()
  // All hooks must be called before any early returns
  const [hideCategory, setHideCategory] = useState(faqItems?.hideCategory)
  const [isOpen, setIsOpen] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

  // Compute JSON-LD data (needed for useEffect)
  const jsonLd = faqJsonLd(faqItems);
  const hasQuestions = jsonLd?.mainEntity && Array.isArray(jsonLd.mainEntity) && jsonLd.mainEntity.length > 0;

  // JSON-LD script injection useEffect
  React.useEffect(() => {
    if (hasQuestions) {
      const scriptId = `faqJSON-${faqItems?._uid || Date.now()}`;
      // Remove existing script if it exists
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById(scriptId);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [hasQuestions, jsonLd, faqItems?._uid]);

  // Early return if no FAQ items (after all hooks)
  if (!faqItems || (!faqItems.faqCategories && !Array.isArray(faqItems))) {
    return null;
  }
  
  const showActiveCategory = (categoryKey: string) => {
    if (categoryKey === activeCategory) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveCategory(categoryKey)
      setIsTransitioning(false)
    }, 150)
  }
  
  const toggleQuestion = (questionKey: string) => {
    setIsOpen(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }))
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
    <Section className="py-sm md:py-md lg:py-lg">
    <Container className='py-16 flex-col gap-16'>
      <div className='flex flex-col md:gap-16 gap-6 font-manrope font-bold leading-[120%]'>
      <div className='flex md:flex-row flex-col gap-2 md:justify-between justify-start items-center md:items-start'>
        <h2 className='md:text-[40px] text-2xl leading-[120%] md:max-w-[500px] md:text-left text-center'>Frequently Asked Questions</h2>
        <div className='flex flex-col gap-2 font-inter'>
          <div className='flex flex-row gap-2'>
            <p className='text-gray-600 md:text-left text-center font-normal  font-inter text-base leading-[145%]'>Support:</p>
            <a href={`mailto:${contactData?.contactEmail}`} className='text-vs-blue font-medium text-base leading-[145%] font-inter'>{contactData?.contactEmail}</a>
            
          </div>
          <div className='flex flex-row gap-2'>
            <p className='text-gray-600 md:text-left text-center font-normal  font-inter text-base leading-[145%]'>Sales:</p>
            <a href={`mailto:${contactData?.salesEmail}`} className='text-vs-blue font-medium text-base leading-[145%] font-inter'>{contactData?.salesEmail}</a>
          </div>
        </div>
      </div>

      <div className='flex lg:flex-row flex-col md:gap-16 gap-6'>
        {/* Mobile Dropdown */}
       { !hideCategory && <div className="lg:hidden w-full">
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-left font-medium leading-[155%] md:text-lg text-sm text-gray-950"
            >
              <span>{activeCategoryData?.categoryName || 'Select Category'}</span>
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
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
                    className={`w-full text-left px-3 py-2 font-medium leading-[155%] md:text-lg text-sm transition-colors first:rounded-t-[12px] last:rounded-b-[12px] hover:bg-gray-50 ${
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
        <div className="hidden lg:flex flex-col gap-1.5">
          {categories.map((category: any) => (
            <button 
              key={category._key}
              onClick={() => showActiveCategory(category._key)} 
              className={`text-left cursor-pointer font-geist w-[374px] tracking-normal rounded-[12px] font-medium leading-[155%] text-lg px-3 py-2 transition-colors ${
                activeCategory === category._key 
                  ? 'bg-white text-gray-950' 
                  : 'text-gray-500'
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>)}

        {/* Questions and Answers */}
        <div className='flex-1'>
          {activeQuestions.length > 0 ? (
            <div className={`gap-6 flex flex-col transition-all duration-300 ease-in-out ${
              isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
              {activeQuestions.map((question: any, index: number) => {
                const questionKey = question._key || index
                const isQuestionOpen = isOpen[questionKey] || false
                
                return (
                  <div 
                    key={questionKey} 
                    className={`border md:rounded-[16px] rounded-[8px] md:p-6 p-4 transition-all duration-300 ease-in-out ${
                      isQuestionOpen 
                        ? 'bg-gray-200 border-none shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <button
                      onClick={() => toggleQuestion(questionKey)}
                      className="w-full text-left flex items-center justify-between rounded-[16px] transition-all duration-200 ease-in-out"
                    >
                      <dt className="font-medium font-geist tracking-normal leading-[155%] md:text-lg text-base text-gray-950 pr-4">
                        {question.question}
                      </dt>
                      <div className="flex-shrink-0 transition-transform duration-200 ease-in-out">
                        {isQuestionOpen ? (
                          <Minus className="w-5 h-5 text-gray-950 rotate-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-950 rotate-0" />
                        )}
                      </div>
                    </button>
                    <div 
                      className={`font-geist overflow-hidden transition-all duration-300 ease-in-out ${
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
        </div>
      </div>
      </div>
    </Container>
    </Section>
    </>
  )
}
