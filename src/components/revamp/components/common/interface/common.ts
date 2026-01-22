import { ReactNode } from 'react';

export interface IdataProps {
    id: string;
    testimonial: any;
    title: string,
    key: string,
    setActiveTab: (key: string) => void
}
export interface SectionHeaderProps {
    heading?: string,
    subheading?: string,
    description?: string,
    mailId?: string,
    isWhite?: boolean,
    isLeftAlign?: boolean,
    headingSm?: boolean
    className?: string
    showFullLength?: boolean
}
export interface SectionHeaderPropsV2 {
    heading?: string | ReactNode,
    subheading?: string,
    description?: any | ReactNode,
    mailId?: string,
    isWhite?: boolean,
    isLeftAlign?: boolean,
    headingSm?: boolean
    className?: string
    showFullLength?: boolean
    ctaListItems?: Array<{
        ctaLink?: string
        ctaText?: string
        ctaType?: string
    }>
    demoButton?: boolean
    headingMd?: boolean
}

interface IFaqItemProps {
    answer: ReactNode | Iterable<ReactNode>;
    question: string;
}

export interface FaqSectionProps {
    faqItems: Array<IFaqItemProps>
}