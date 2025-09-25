export interface IdataProps {
    title: string,
    key: string,
    setActiveTab: (key: string) => void
}
export interface SectionHeaderProps {
    heading?: string,
    subheading?: string,
    description?: string,
    mailId?: string
    headingSm?: boolean
    className?: string
}

import { ReactNode } from 'react';

interface IFaqItemProps {
    answer: ReactNode | Iterable<ReactNode>;
    question: string;
}

export interface FaqSectionProps {
    faqItems: Array<IFaqItemProps>
}