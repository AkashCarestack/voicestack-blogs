import React, { use, useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import SectionHeader from './sectionHeader'
import Container from '~/components/structure/Container'

export default function FaqSection({ faqItems }: any) {

  const [hideCategory, setHideCategory] = useState(faqItems?.hideCategory)
  const [isOpen, setIsOpen] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categories = faqItems?.faqCategories || []
  
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

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-gray-600 md:text-base text-sm leading-[145%] md:pt-4 pt-2">
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }: { children: React.ReactNode }) => (
        <em className="italic">{children}</em>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc list-inside space-y-1">{children}</ul>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal list-inside space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <li className="text-gray-600 md:text-base text-sm leading-[145%]">{children}</li>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <li className="text-gray-600 md:text-base text-sm leading-[145%]">{children}</li>
      ),
    },
  }

  return (
    <Container className='py-16 flex-col gap-16'>
      <SectionHeader
        heading={'Frequently Asked Questions'}
        description={'For queries contact'}
        mailId={'support@voicestack.com'}
      />
      <div className='flex lg:flex-row flex-col md:gap-16 gap-6'>
        {/* Mobile Dropdown */}
        <div className="lg:hidden w-full">
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
        </div>

        {/* Desktop Categories Sidebar */}
        { !hideCategory && (
        <div className="hidden lg:flex flex-col gap-1.5">
          {categories.map((category: any) => (
            <button 
              key={category._key}
              onClick={() => showActiveCategory(category._key)} 
              className={`text-left cursor-pointer w-[374px] rounded-[12px] font-medium leading-[155%] text-lg px-3 py-2 transition-colors ${
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
                    className={`border rounded-[16px] md:p-4 p-2 py-6 px-4  transition-all duration-300 ease-in-out ${
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
                      <div className="font-medium md:text-lg text-base text-gray-950 pr-4">
                        {question.question}
                      </div>
                      <div className="flex-shrink-0 transition-transform duration-200 ease-in-out">
                        {isQuestionOpen ? (
                          <Minus className="w-5 h-5 text-gray-950 rotate-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-950 rotate-0" />
                        )}
                      </div>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isQuestionOpen 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="text-gray-600">
                        {question.answer && Array.isArray(question.answer) ? (
                          <PortableText 
                            value={question.answer} 
                            components={components}
                          />
                        ) : (
                         null
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : <></>}
        </div>
      </div>
    </Container>
  )
}
