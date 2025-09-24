import { StructureBuilder } from 'sanity/desk'
import { 
  CogIcon, 
  HomeIcon, 
  DocumentIcon, 
  StarIcon, 
  BoltIcon, 
  ExpandIcon,
  UsersIcon,
  TagIcon,
  ImageIcon,
  DocumentTextIcon,
  HelpCircleIcon,
  CommentIcon,
  StackIcon,
  EarthGlobeIcon,
  WrenchIcon,
  FolderIcon,
  StringIcon,
  OlistIcon
} from '@sanity/icons'

// Schema type to icon mapping
const schemaIconMap: Record<string, any> = {
  // Core Settings
  siteSettings: CogIcon,
  homeSettings: HomeIcon,
  layout: CogIcon,
  
      // Pages & Content Management
    page: DocumentIcon,
    whoWeServe: UsersIcon,
    dentalSoftware: DocumentIcon,
    globalData: FolderIcon,
    features: BoltIcon,
  
  // Content Types
  testimonial: StarIcon,
  testimonialSection: CommentIcon,
  testimonialHighlightSection: CommentIcon,
  
  // Features & Components
  Features: BoltIcon,
  feature: BoltIcon,
  featureList: BoltIcon,
  featureCategory: BoltIcon,
  featureSubSection: BoltIcon,
  heroSubFeature: BoltIcon,
  
  // Legal & Documentation
  legal: DocumentTextIcon,
  faq: HelpCircleIcon,
  
  // Comparisons & Analysis
  comparison: StackIcon,
  comparisonTable: StackIcon,
  comparisonValue: TagIcon,
  
  // Platforms & Integrations
  Platforms: EarthGlobeIcon,
  platform: EarthGlobeIcon,
  platformList: TagIcon,
  
  // Content Blocks
  logoListing: ImageIcon,
  cardsListing: StackIcon,
  csCardsListing: StackIcon,
  verticalTestimonialListing: StackIcon,
  listingBlock: StackIcon,
  listingAtom: StackIcon,
  browserList: OlistIcon,
  
  // Media & Content
  banner: ImageIcon,
  footer: WrenchIcon,
  miscellaneous: ExpandIcon,
  
  // Dynamic Components
  DynamicComponent: BoltIcon,
  
  // Content Management
  author: UsersIcon,
  centralizedTestimonial: CommentIcon,
  featureItem: StarIcon,
  

}

// Custom title mapping for specific schemas
const customTitleMap: Record<string, string> = {
  page: 'Pages',
  whoWeServe: 'Who We Serve',
  dentalSoftware: 'Dental Software',
  globalData: 'Global Data',
  testimonial: 'Feature Main',
  testimonialSection: 'Testimonial Section',
  testimonialHighlightSection: 'Testimonial Highlight Section',
  DynamicComponent: 'Dynamic Components'
}

// Convert camelCase to Title Case
function toTitleCase(str: string): string {
  // Check if we have a custom title for this schema
  if (customTitleMap[str]) {
    return customTitleMap[str]
  }
  
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// Get the base schema name (before underscore)
function getBaseSchemaName(schemaName: string): string {
  return schemaName.split('_')[0]
}

// Check if a schema name is a localized version
function isLocalizedSchema(schemaName: string): boolean {
  return schemaName.includes('_')
}

// Get the language suffix from a localized schema name
function getLanguageSuffix(schemaName: string): string {
  const parts = schemaName.split('_')
  if (parts.length > 1) {
    const lang = parts[parts.length - 1]
    const langMap: Record<string, string> = {
      'en': 'US English',
      'enGB': 'UK English', 
      'enAU': 'Australia English'
    }
    return langMap[lang] || lang
  }
  return 'Default'
}

export function createDeskStructure(S: StructureBuilder, schemaTypes: string[]) {
  // Group schemas by category
  const schemaGroups = {
    // Core Settings & Configuration
    settings: ['siteSettings', 'homeSettings', 'layout'],
    
    // Pages & Content Management - NEW PROMINENT SECTION
    pages: ['page', 'whoWeServe', 'dentalSoftware', 'globalData', 'features'],
    
    // Content Management - Centralized Data
    contentManagement: ['author', 'centralizedTestimonial', 'featureItem'],
    
    // Content Management (existing)
    content: ['testimonialHighlightSection'],
    
    // Features & Components
    features: ['featureList', 'featureCategory', 'featureSubSection', 'heroSubFeature', 'testimonial'],
    
    // Testimonial Section
    testimonialSection: ['testimonialSection'],
    
    // Legal & Documentation
    legal: ['legal', 'faq'],
    
    // Comparisons & Analysis
    comparisons: ['comparison', 'comparisonTable', 'comparisonValue'],
    
    // Platforms & Integrations
    platforms: ['Platforms', 'platform', 'platformList'],

    faqRevamp: ['faqRevamp'],
    
    // Blocks & Lists
    blocks: ['logoListing', 'verticalTestimonialListing', 'cardsListing', 'csCardsListing', 'listingBlock', 'listingAtom', 'browserList'],
    
    // Media & UI
    media: ['banner', 'footer', 'miscellaneous'],
    
    // Dynamic Components
    dynamic: ['DynamicComponent'],
    
    // Utilities
    utilities: []
  }

  const items = []

  // Create folder groups
  for (const [category, schemas] of Object.entries(schemaGroups)) {
    // Filter to only include schemas that exist
    const existingSchemas = schemas.filter(schema => schemaTypes.includes(schema))
    
    if (existingSchemas.length === 0) continue

    // Get category icon and title
    const categoryIcon = getCategoryIcon(category)
    const categoryTitle = getCategoryTitle(category)

    if (existingSchemas.length === 1) {
      // Single schema - show directly
      const schemaName = existingSchemas[0]
      const icon = schemaIconMap[schemaName] || DocumentIcon
      const title = toTitleCase(schemaName)
      
      // Special handling for Who We Serve to show language indicators
      if (schemaName === 'whoWeServe') {
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.list()
                .title(title)
                .items([
                  // All Who We Serve documents
                  S.listItem()
                    .title('All Who We Serve')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('whoWeServe')
                        .title('All Who We Serve')
                        .filter('_type == "whoWeServe"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // US English
                  S.listItem()
                    .title('US English (en)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('whoWeServe')
                        .title('US English Who We Serve')
                        .filter('_type == "whoWeServe" && language == "en"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // UK English
                  S.listItem()
                    .title('UK English (en-GB)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('whoWeServe')
                        .title('UK English Who We Serve')
                        .filter('_type == "whoWeServe" && language == "en-GB"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Australia English
                  S.listItem()
                    .title('Australia English (en-AU)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('whoWeServe')
                        .title('Australia English Who We Serve')
                        .filter('_type == "whoWeServe" && language == "en-AU"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Create new
                  S.listItem()
                    .title('Create New Who We Serve')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('whoWeServe')
                        .title('Create New Who We Serve')
                        .filter('_type == "whoWeServe"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    )
                ])
            )
        )
      } else if (schemaName === 'features') {
        // Special handling for Features to show language indicators
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.list()
                .title(title)
                .items([
                  // All Features documents
                  S.listItem()
                    .title('All Features')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('features')
                        .title('All Features')
                        .filter('_type == "features"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // US English
                  S.listItem()
                    .title('US English (en)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('features')
                        .title('US English Features')
                        .filter('_type == "features" && language == "en"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // UK English
                  S.listItem()
                    .title('UK English (en-GB)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('features')
                        .title('UK English Features')
                        .filter('_type == "features" && language == "en-GB"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Australia English
                  S.listItem()
                    .title('Australia English (en-AU)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('features')
                        .title('Australia English Features')
                        .filter('_type == "features" && language == "en-AU"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Create new
                  S.listItem()
                    .title('Create New Feature')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('features')
                        .title('Create New Feature')
                        .filter('_type == "features"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    )
                ])
            )
        )
      } else {
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.documentTypeList(schemaName)
                .title(title)
            )
        )
      }
    } else {
      // Multiple schemas - create folder
      items.push(
        S.listItem()
          .title(categoryTitle)
          .icon(categoryIcon)
          .child(
            S.list()
              .title(categoryTitle)
              .items(
                existingSchemas.map(schemaName => {
                  const icon = schemaIconMap[schemaName] || DocumentIcon
                  const title = toTitleCase(schemaName)
                  
                  return S.listItem()
                    .title(title)
                    .icon(icon)
                    .child(
                      S.documentTypeList(schemaName)
                        .title(title)
                    )
                })
              )
          )
      )
    }
  }

  return S.list()
    .title('Content')
    .items(items)
}

// Get icon for each category
function getCategoryIcon(category: string) {
  const iconMap: Record<string, any> = {
    settings: CogIcon,
    pages: DocumentIcon,
    contentManagement: UsersIcon,
    content: DocumentIcon,
    features: BoltIcon,
    testimonialSection: CommentIcon,
    legal: DocumentTextIcon,
    comparisons: StackIcon,
    platforms: EarthGlobeIcon,
    blocks: OlistIcon,
    media: ImageIcon,
    dynamic: BoltIcon,
    utilities: WrenchIcon
  }
  return iconMap[category] || FolderIcon
}

// Get readable title for each category
function getCategoryTitle(category: string) {
  const titleMap: Record<string, string> = {
    settings: 'Settings & Configuration',
    pages: 'Pages & Content Management',
    contentManagement: 'Centralized Content Management',
    content: 'Content Management',
    features: 'Features & Components',
    testimonialSection: 'Testimonial Section',
    legal: 'Legal & Documentation',
    comparisons: 'Comparisons & Analysis',
    platforms: 'Platforms & Integrations',
    blocks: 'Blocks & Lists',
    media: 'Media & UI Elements',
    dynamic: 'Dynamic Components',
    utilities: 'Utilities',
    faqRevamp: 'FAQ Revamp'

  }
  return titleMap[category] || toTitleCase(category)
}
