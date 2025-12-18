import { 
  BoltIcon, 
  CogIcon, 
  CommentIcon,
  DocumentIcon, 
  DocumentTextIcon,
  EarthGlobeIcon,
  ExpandIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon, 
  ImageIcon,
  OlistIcon,
  StackIcon,
  StarIcon, 
  StringIcon,
  TagIcon,
  UsersIcon,
  WrenchIcon} from '@sanity/icons'
import { StructureBuilder } from 'sanity/desk'

// Schema type to icon mapping
const schemaIconMap: Record<string, any> = {
  // Core Settings
  siteSettings: CogIcon,
  homeSettings: HomeIcon,
  layout: CogIcon,
  
      // Pages & Content Management
    page: DocumentIcon,
    homePage: HomeIcon,
    whoWeServe: UsersIcon,
    dentalSoftware: DocumentIcon,
    dentalPhones: DocumentIcon,
    company: DocumentIcon,
    partner: DocumentIcon,
    globalData: FolderIcon,
    features: BoltIcon,
    whyVoicestack: DocumentIcon,
  // Content Types
  testimonial: StarIcon,
  testimonialSection: CommentIcon,
  testimonialHighlightSection: CommentIcon,
  
  // Features & Components
  Features: BoltIcon,
  feature: BoltIcon,
  featureList: BoltIcon,
  featureSubSection: BoltIcon,
  heroSubFeature: BoltIcon,
  featureCategory: TagIcon,
  featureCategoryOld: TagIcon,
  
  // Integration Components
  integrationCategory: TagIcon,
  integrationList: BoltIcon,
  
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
  partnerListing: ImageIcon,
  csCardsListing: StackIcon,
  whoWeServeListing: StackIcon,
  verticalTestimonialListing: StackIcon,
  
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
  homePage: 'Home Page',
  whoWeServe: 'Who We Serve',
  dentalSoftware: 'Dental Software',
  dentalPhones: 'Dental Phones',
  whyVoicestack: 'Why Voicestack',
  company: 'Company Page',
  partner: 'Partner Page',
  globalData: 'Global Data',
  testimonial: 'Feature Main',
  testimonialSection: 'Testimonial Section',
  testimonialHighlightSection: 'Testimonial Highlight Section',
  DynamicComponent: 'Dynamic Components',
  featureCategory: 'Feature Categories',
  featureCategoryOld: 'Feature Categories (Old)',
  integrationCategory: 'Integration Categories',
  integrationList: 'Integration List',
  faqRevamp: 'Page Faqs'
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
    pages: ['page', 'homePage','whoWeServe', 'whyVoicestack', 'dentalSoftware', 'dentalPhones', 'aiReceptionist', 'featurePage', 'company', 'partner', 'globalData', 'features', 'featureCategory'],
    
    // Content Management - Centralized Data
    contentManagement: ['author', 'centralizedTestimonial', 'featureItem'],
    
    // Content Management (existing)
    content: ['testimonialHighlightSection'],
    
    // Features & Components
    features: ['featureList', 'featureSubSection', 'heroSubFeature', 'testimonial'],
    
    // Testimonial Section
    testimonialSection: ['testimonialSection'],
    
    // Legal & Documentation
    legal: ['legal', 'faq'],
    
    // Comparisons & Analysis
    comparisons: ['comparison', 'comparisonTable', 'comparisonValue'],
    
    // Platforms & Integrations
    platforms: ['Platforms', 'platform', 'platformList', 'integrationCategory', 'integrationList'],

    faqRevamp: ['faqRevamp'],
    
    // Blocks & Lists
    blocks: ['logoListing', 'partnerListing', 'verticalTestimonialListing', 'csCardsListing', 'whoWeServeListing', 'genericItemsListing'],
    
    // Media & UI
    media: ['banner', 'footer', 'miscellaneous'],
    
    // Dynamic Components
    dynamic: ['DynamicComponent'],
    
    // Utilities
    utilities: ['featureCategoryOld']
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
      } else if (schemaName === 'homePage') {
        // Special handling for Home Page to show language indicators
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.list()
                .title(title)
                .items([
                  // All Home Page documents
                  S.listItem()
                    .title('All Home Page')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('homePage')
                        .title('All Home Page')
                        .filter('_type == "homePage"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // US English
                  S.listItem()
                    .title('🇺🇸 US English (en)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentList()
                        .title('US English Home Page')
                        .schemaType('homePage')
                        .filter('_type == "homePage" && language == "en"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                        .initialValueTemplates([
                          S.initialValueTemplateItem('homePage-en')
                        ])
                    ),
                  // UK English
                  S.listItem()
                    .title('🇬🇧 UK English (en-GB)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentList()
                        .title('UK English Home Page')
                        .schemaType('homePage')
                        .filter('_type == "homePage" && language == "en-GB"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                        .initialValueTemplates([
                          S.initialValueTemplateItem('homePage-en-GB')
                        ])
                    ),
                  // Australia English
                  S.listItem()
                    .title('🇦🇺 Australia English (en-AU)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentList()
                        .title('Australia English Home Page')
                        .schemaType('homePage')
                        .filter('_type == "homePage" && language == "en-AU"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                        .initialValueTemplates([
                          S.initialValueTemplateItem('homePage-en-AU')
                        ])
                    ),
                ])
            )
        )
      }
      else if (schemaName === 'dentalPhones') {
        // Special handling for Dental Phones to show language indicators
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.list()
                .title(title)
                .items([
                  // All Dental Phones documents
                  S.listItem()
                    .title('All Dental Phones')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('dentalPhones')
                        .title('All Dental Phones')
                        .filter('_type == "dentalPhones"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // US English
                  S.listItem()
                    .title('US English (en)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('dentalPhones')
                        .title('US English Dental Phones')
                        .filter('_type == "dentalPhones" && language == "en"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // UK English
                  S.listItem()
                    .title('UK English (en-GB)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('dentalPhones')
                        .title('UK English Dental Phones')
                        .filter('_type == "dentalPhones" && language == "en-GB"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Australia English
                  S.listItem()
                    .title('Australia English (en-AU)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('dentalPhones')
                        .title('Australia English Dental Phones')
                        .filter('_type == "dentalPhones" && language == "en-AU"')
                        .defaultOrdering([{field: 'order', direction: 'asc'}])
                    ),
                  // Create new
                  S.listItem()
                    .title('Create New Dental Phone Page')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('dentalPhones')
                        .title('Create New Dental Phone Page')
                        .filter('_type == "dentalPhones"')
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
                        .defaultOrdering([{field: 'language', direction: 'asc'}, {field: 'order', direction: 'asc'}])
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
      } else if (schemaName === 'featureCategory') {
        // Special handling for Feature Categories to show language indicators
        items.push(
          S.listItem()
            .title(title)
            .icon(icon)
            .child(
              S.list()
                .title(title)
                .items([
                  // All Feature Categories documents
                  S.listItem()
                    .title('All Feature Categories')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('featureCategory')
                        .title('All Feature Categories')
                        .filter('_type == "featureCategory"')
                        .defaultOrdering([{field: 'name', direction: 'asc'}])
                    ),
                  // US English
                  S.listItem()
                    .title('US English (en)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('featureCategory')
                        .title('US English Feature Categories')
                        .filter('_type == "featureCategory" && language == "en"')
                        .defaultOrdering([{field: 'name', direction: 'asc'}])
                    ),
                  // UK English
                  S.listItem()
                    .title('UK English (en-GB)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('featureCategory')
                        .title('UK English Feature Categories')
                        .filter('_type == "featureCategory" && language == "en-GB"')
                        .defaultOrdering([{field: 'name', direction: 'asc'}])
                    ),
                  // Australia English
                  S.listItem()
                    .title('Australia English (en-AU)')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('featureCategory')
                        .title('Australia English Feature Categories')
                        .filter('_type == "featureCategory" && language == "en-AU"')
                        .defaultOrdering([{field: 'name', direction: 'asc'}])
                    ),
                  // Create new
                  S.listItem()
                    .title('Create New Feature Category')
                    .icon(DocumentIcon)
                    .child(
                      S.documentTypeList('featureCategory')
                        .title('Create New Feature Category')
                        .filter('_type == "featureCategory"')
                        .defaultOrdering([{field: 'name', direction: 'asc'}])
                    )
                ])
            )
        )
      } else if (category === 'platforms') {
        // Special handling for Platforms & Integrations section
        items.push(
          S.listItem()
            .title(categoryTitle)
            .icon(categoryIcon)
            .child(
              S.list()
                .title(categoryTitle)
                .items([
                  // Platforms
                  S.listItem()
                    .title('Platforms')
                    .icon(EarthGlobeIcon)
                    .child(
                      S.documentTypeList('Platforms')
                        .title('Platforms')
                    ),
                  S.listItem()
                    .title('Platform')
                    .icon(EarthGlobeIcon)
                    .child(
                      S.documentTypeList('platform')
                        .title('Platform')
                    ),
                  S.listItem()
                    .title('Platform List')
                    .icon(TagIcon)
                    .child(
                      S.documentTypeList('platformList')
                        .title('Platform List')
                    ),
                  
                  // Integration Categories
                  S.listItem()
                    .title('Integration Categories')
                    .icon(TagIcon)
                    .child(
                      S.list()
                        .title('Integration Categories')
                        .items([
                          // US English
                          S.listItem()
                            .title('US English (en)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationCategory')
                                .title('US English Integration Categories')
                                .filter('_type == "integrationCategory" && language == "en"')
                                .defaultOrdering([{field: 'name', direction: 'asc'}])
                            ),
                          // UK English
                          S.listItem()
                            .title('UK English (en-GB)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationCategory')
                                .title('UK English Integration Categories')
                                .filter('_type == "integrationCategory" && language == "en-GB"')
                                .defaultOrdering([{field: 'name', direction: 'asc'}])
                            ),
                          // Australia English
                          S.listItem()
                            .title('Australia English (en-AU)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationCategory')
                                .title('Australia English Integration Categories')
                                .filter('_type == "integrationCategory" && language == "en-AU"')
                                .defaultOrdering([{field: 'name', direction: 'asc'}])
                            ),
                          // Create new
                          S.listItem()
                            .title('Create New Integration Category')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationCategory')
                                .title('Create New Integration Category')
                                .filter('_type == "integrationCategory"')
                                .defaultOrdering([{field: 'name', direction: 'asc'}])
                            )
                        ])
                    ),
                  
                  // Integration List
                  S.listItem()
                    .title('Integration List')
                    .icon(BoltIcon)
                    .child(
                      S.list()
                        .title('Integration List')
                        .items([
                          // All Integration List documents
                          S.listItem()
                            .title('All Integration List')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationList')
                                .title('All Integration List')
                                .filter('_type == "integrationList"')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                            ),
                          // US English
                          S.listItem()
                            .title('US English (en)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationList')
                                .title('US English Integration List')
                                .filter('_type == "integrationList" && language == "en"')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                            ),
                          // UK English
                          S.listItem()
                            .title('UK English (en-GB)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationList')
                                .title('UK English Integration List')
                                .filter('_type == "integrationList" && language == "en-GB"')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                            ),
                          // Australia English
                          S.listItem()
                            .title('Australia English (en-AU)')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationList')
                                .title('Australia English Integration List')
                                .filter('_type == "integrationList" && language == "en-AU"')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                            ),
                          // Create new
                          S.listItem()
                            .title('Create New Integration List')
                            .icon(DocumentIcon)
                            .child(
                              S.documentTypeList('integrationList')
                                .title('Create New Integration List')
                                .filter('_type == "integrationList"')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                            )
                        ])
                    ),
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
    faqRevamp: 'Page Faqs'

  }
  return titleMap[category] || toTitleCase(category)
}
