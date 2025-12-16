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

import { ReactNode } from 'react';

interface IFaqItemProps {
    answer: ReactNode | Iterable<ReactNode>;
    question: string;
}

export interface FaqSectionProps {
    faqItems: Array<IFaqItemProps>
}