export interface IdataProps {
    title: string,
    key: string,
    setActiveTab: (key: string) => void
}
export interface SectionHeaderProps {
    heading?: string,
    subheading?: string,
    description?: string
}