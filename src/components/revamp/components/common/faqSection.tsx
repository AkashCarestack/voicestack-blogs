import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import Head from 'next/head'
import { faqJsonLd } from '~/components/utils/jsonld'
import { useLayoutData } from '~/providers/LayoutDataProvider'
import SectionHeaderV2 from '../../../../v2/components/common/sectionHeaderV2'
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
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.83325 14.1663L14.1666 5.83301"
          stroke="black"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const CategoryIndicatorIcon = ({ isActive, isHovered }: { isActive: boolean; isHovered: boolean }) => {
    const shouldShow = isActive || isHovered

    return (
      shouldShow ? <motion.span 
        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
        initial={false}
        animate={{ 
          opacity: shouldShow ? 1 : 0,
          scale: shouldShow ? 1 : 0.8,
          x: shouldShow ? 0 : -4
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <IndicatorIcon />
      </motion.span>
      : null
    )
  }

  const CategoryButton = ({ category, isActive, onClick }: { category: any; isActive: boolean; onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.button 
        onClick={onClick} 
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`font-geist text-base leading-[150%] border-b border-b-gray-200 tracking-normal p-3 !text-left ${
          isActive
            ? 'text-gray-950 font-medium' 
            : 'text-gray-500 font-normal'
        }`}
      >
       <div className='flex flex-row gap-2 items-center'>
         <CategoryIndicatorIcon isActive={isActive} isHovered={isHovered} />
         <span className='relative inline-block'>
           <span className='font-medium invisible' aria-hidden="true" style={{ display: 'inline-block' }}>{category.categoryName}</span>
           <motion.span 
             className='absolute top-0 left-0'
             animate={{
               fontWeight: isActive || isHovered ? 500 : 400,
               color: isActive || isHovered ? '#030712' : '#6B7280'
             }}
             transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
           >
             {category.categoryName}
           </motion.span>
         </span>
       </div>
      </motion.button>
    )
  }

  const ContactInfoItem = ({ className, label, email, emailTextSize = 'xl:text-base' }: { className?: string; label: string; email: string; emailTextSize?: string }) => {
    return (
      <div className={`flex overflow-auto !bg-[#F9FAFB] md:flex-col flex-row gap-2 xl:px-6 px-3 xl:py-3 py-2 border-t border-b border-[#E5E7EB] w-full ${className}`}>
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
       <div className='flex-1 lg:max-w-[370px]'> <SectionH2 content='Frequently Asked Questions' /> </div>
        {/* <h2 className='font-manrope flex-1 max-w-[369px] md:text-5xl text-2xl md:font-semibold font-medium  leading-tight tracking-tight text-gray-950'>Frequently Asked Questions</h2> */}
        <div className='flex md:flex-row flex-col w-full flex-1 max-w-[712px]  overflow-auto'>
        <div className=' hidden  flex-col md:max-w-[200px] w-full bg-[#F9FAFB] xl:px-6 px-3 xl:py-3 py-2'>
            <p className="font-geist xl:text-base text-sm font-normal leading-[150%] tracking-normal text-gray-700">For further queries contact:</p>
          </div>
          <ContactInfoItem 
            label="Support" 
            email={contactData?.contactEmail || ''} 
            emailTextSize="xl:text-base"
            className="md:border-l md:border-r-0 border-l border-r border-b md:rounded-l-[6px] md:rounded-r-none rounded-[6px] mb-1.5 md:mb-0"
          />
          <ContactInfoItem 
            label="Sales" 
            email={contactData?.salesEmail || ''} 
            emailTextSize="xl:text-base"
            className="border-l border-r md:rounded-r-[6px] md:rounded-l-none rounded-[6px]"
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
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {categories.map((category: any) => (
                    <motion.button
                      key={category._key}
                      onClick={() => {
                        showActiveCategory(category._key)
                        setIsDropdownOpen(false)
                      }}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-3 py-2 font-medium leading-[155%] md:text-lg text-sm first:rounded-t-[12px] last:rounded-b-[12px] ${
                        activeCategory === category._key 
                          ? 'bg-gray-100 text-gray-950' 
                          : 'text-gray-500'
                      }`}
                    >
                       {category.categoryName}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>}

        {/* Desktop Categories Sidebar */}
        { !hideCategory && (
        <div className="hidden lg:flex flex-col sticky top-[100px] self-start gap-1.5 flex-1 max-w-[369px]">
          {categories.map((category: any) => (
            <CategoryButton
              key={category._key}
              category={category}
              isActive={activeCategory === category._key}
              onClick={() => showActiveCategory(category._key)}
            />
          ))}
        </div>)}

        {/* Questions and Answers */}
        {/* <div className='flex-1'> */}
          <AnimatePresence mode="wait">
            {activeQuestions.length > 0 && (
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`gap-3 flex flex-col flex-1 ${hideCategory ? '' : 'lg:max-w-[712px]'}`}
              >
                {activeQuestions.map((question: any, index: number) => {
                  const questionKey = question._key || index
                  const isQuestionOpen = isOpen[questionKey] || false
                  
                  return (
                    <motion.div 
                      onClick={() => toggleQuestion(questionKey)}
                      key={questionKey} 
                      className={`cursor-pointer border md:rounded-[16px] rounded-[6px] md:p-6 p-4 border-gray-200 ${!isQuestionOpen ? 'bg-white' : '!bg-[#F9FAFB]'}`}
                      whileHover={!isQuestionOpen ? { 
                        backgroundColor: '#F9FAFB',
                      } : {}}
                      
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <button
                        className="w-full text-left flex items-center justify-between rounded-[16px]"
                      >
                        <dt className="font-medium font-geist tracking-normal leading-[155%] md:text-lg text-base text-gray-950 pr-4">
                          {question.question}
                        </dt>
                        <div className="flex-shrink-0">
                          <motion.div
                            animate={{ rotate: isQuestionOpen ? 0 : 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <AnimatePresence mode="wait">
                              {isQuestionOpen ? (
                                <motion.div
                                  key="minus"
                                  initial={{ opacity: 0, rotate: -90 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  exit={{ opacity: 0, rotate: 90 }}
                                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                >
                                  <Minus className="w-5 h-5 text-gray-950" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="plus"
                                  initial={{ opacity: 0, rotate: 90 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  exit={{ opacity: 0, rotate: -90 }}
                                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                >
                                  <Plus className="w-5 h-5 text-gray-950" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isQuestionOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              ease: [0.4, 0, 0.2, 1],
                              opacity: { duration: 0.2 }
                            }}
                            className="font-geist overflow-hidden"
                          >
                            {question.answer && Array.isArray(question.answer) ? (
                              <PortableText 
                                value={question.answer.filter((block: any) => !isBlockEmpty(block))} 
                                components={components}
                              />
                            ) : (
                             null
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        {/* </div> */}
      </div>
      </div>
    </Container>
    </Section>
    </>
  )
}
