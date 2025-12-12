import { InsertBelowIcon } from '@sanity/icons'
import { componentSchemas } from './Components'
import { ListingSchema } from './Components/ComparisonSchema'

const dynamicComponent = {
  name: 'dynamicComponent',
  title: 'Dynamic Component',
  icon: InsertBelowIcon,
  type: 'object',
  fields: [
    {
      name: 'componentType',
      title: 'Component Type',
      type: 'string',
      options: {
        list: [
          { title: 'Tabs Listing Component', value: 'TabsListing' },
          { title: 'Custom Component', value: 'Custom' },
          { title: 'Hero Component', value: 'Hero' },
          { title: 'Generic Listing Component', value: 'GenericListing' },
          { title: 'Browser List', value: 'browserList' },
          { title: 'Listing Block', value: 'listingBlock' },
          { title: 'Comparison Schema', value: 'comparisonSchema' },
          { title: 'Feature Benefit Component', value: 'FeatureBenefit' },
          { title: 'Feature Category Component', value: 'FeatureCategory' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    // Dynamic component fields based on type
    {
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component',
      type: 'tabsListingComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'TabsListing',
    },
    {
      name: 'customComponent',
      title: 'Custom Component',
      type: 'customComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Custom',
    },
    {
      name: 'heroComponent',
      title: 'Hero Component',
      type: 'heroComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Hero',
    },
    {
      name: 'genericListingComponent',
      title: 'Generic Listing Component',
      type: 'genericListingComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'GenericListing',
    },
    {
      name: 'browserList',
      title: 'Browser List',
      type: 'browserList',
      hidden: ({ parent }: any) => parent?.componentType !== 'browserList',
    },
    {
      name: 'listingBlock',
      title: 'Listing Block',
      type: 'listingBlock',
      hidden: ({ parent }: any) => parent?.componentType !== 'listingBlock',
    },
    {
      name: 'comparisonSchema',
      title: 'Comparison Schema',
      type: 'comparisonSchema',
      hidden: ({ parent }: any) => parent?.componentType !== 'comparisonSchema',
    },
    {
      name: 'featureBenefitComponent',
      title: 'Feature Benefit Component',
      type: 'featureBenefitComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'FeatureBenefit',
    },
    {
      name: 'featureCategoryComponent',
      title: 'Feature Category Component',
      type: 'featureCategoryComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'FeatureCategory',
    },
  ],
  preview: {
    select: {
      title: 'componentType',
      tabsTitle: 'tabsListingComponent.headline',
      customTitle: 'customComponent.title',
      heroTitle: 'heroComponent.heroheading',
      heroStrip: 'heroComponent.heroStrip',
      genericListingTitle: 'genericListingComponent.heading',
      browserListTitle: 'browserList.mainHeading',
      listingBlockTitle: 'listingBlock.itemHeading',
      comparisonSchemaItems: 'comparisonSchema.items',
      featureBenefitTitle: 'featureBenefitComponent.heading',
      featureCategoryTitle: 'featureCategoryComponent.heading',
    },
    prepare(selection: any) {
      const { componentType, tabsTitle, customTitle, heroTitle, heroStrip, genericListingTitle, browserListTitle, listingBlockTitle, comparisonSchemaItems, featureBenefitTitle, featureCategoryTitle } = selection;
      
      let title = componentType || 'Dynamic Component';
      let subtitle = '';
      
      // Get the actual title from the selected component
      if (componentType === 'TabsListing' && tabsTitle) {
        subtitle = tabsTitle;
      } else if (componentType === 'Custom' && customTitle) {
        subtitle = customTitle;
      } else if (componentType === 'Hero') {
        // Extract text from blockContent for hero title
        if (heroTitle && Array.isArray(heroTitle) && heroTitle.length > 0) {
          const firstBlock = heroTitle[0];
          if (firstBlock.children && firstBlock.children.length > 0) {
            subtitle = firstBlock.children[0].text || heroStrip || 'Hero Component';
          }
        } else {
          subtitle = heroStrip || 'Hero Component';
        }
      } else if (componentType === 'GenericListing' && genericListingTitle) {
        subtitle = genericListingTitle;
      } else if (componentType === 'browserList' && browserListTitle) {
        subtitle = browserListTitle;
      } else if (componentType === 'listingBlock' && listingBlockTitle) {
        subtitle = listingBlockTitle;
      } else if (componentType === 'comparisonSchema') {
        const itemCount = comparisonSchemaItems ? comparisonSchemaItems.length : 0;
        subtitle = `Comparison Schema (${itemCount} item${itemCount !== 1 ? 's' : ''})`;
      } else if (componentType === 'FeatureBenefit' && featureBenefitTitle) {
        subtitle = featureBenefitTitle;
      } else if (componentType === 'FeatureCategory' && featureCategoryTitle) {
        subtitle = featureCategoryTitle;
      }
      
      return {
        title: subtitle || title,
        subtitle: subtitle ? `Type: ${title}` : '',
      };
    },
  },
}

export default [dynamicComponent, ListingSchema, ...componentSchemas]