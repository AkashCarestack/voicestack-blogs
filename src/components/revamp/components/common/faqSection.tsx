import React, { use, useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Minus, Plus } from 'lucide-react'
import SectionHeader from './sectionHeader'
import Container from '~/components/structure/Container'

export default function FaqSection({ faqItems }: any) {
  const [isOpen, setIsOpen] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
        <p className="text-gray-600 md:text-base text-sm leading-[145%]">
          {children}
        </p>
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
      <div className='flex flex-row gap-16'>
        {/* Categories Sidebar */}
        <div className="flex flex-col gap-1.5">
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
        </div>

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
                    className={`border rounded-[16px] p-4 transition-all duration-300 ease-in-out ${
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
                      className="w-full text-left flex items-center justify-between rounded-[16px] transition-all duration-200 ease-in-out pb-4 hover:scale-[1.01]"
                    >
                      <div className="font-medium text-lg text-gray-950 pr-4">
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
                      <div className="text-gray-600 pt-2">
                        <PortableText 
                          value={question.answer} 
                          components={components}
                        />
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
