import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common'
import { heroFields } from '../heroSchema'
export default defineType({
  name: 'homeSettings',
  title: 'Home Settings',
  type: 'document',
  options: {
    // Additional options can be added here if needed
  },
  groups: [
    {
      name: 'basic',
      title: 'Basic',
      default: true,
    },
    {
      name: 'hero',
      title: 'Hero',
    },
    {
      name: 'menu',
      title: 'Menu',
    },
    {
      name: 'cta',
      title: 'CTA',
    },
  ],
  fields: [
    // Hero fields from shared schema
    ...heroFields.map(field => ({
      ...field,
      group: 'hero',
    })),

    defineField({
      name: 'dmeoFormId',
      title: 'Demo Form Id',
      type: 'string',
      group: 'basic',
      
    }),
    
    defineField({
      name: 'demoMeetingLink',
      title: 'Demo Meeting Link',
      type: 'string',
      group: 'basic',
    }),
    
    defineField({
      name: 'dmeoFormEventName',
      title: 'Demo Form Event Name',
      type: 'string',
      group: 'basic',
    }),

    defineField({
      name: 'canonical',
      title: 'Canonical',
      type: 'string',
      group: 'basic',
    }),

    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'basic',
    }),
        
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:'Support email',
      group: 'basic',
    }),

    defineField({
      name: 'globalDataReference',
      title: 'Global Data Reference',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'globalData' }],
          options: {
            filter: 'defined(_id)',
          },
        }
      ],
      group: 'basic',
    }),
    defineField({
      name: 'faqReferenced',
      title: 'FAQ',
      type: 'reference',
      to: [{ type: 'faqRevamp' }],
      options: {
        filter: 'defined(_id)',
      },
      group: 'basic',
      
    }),

    defineField({
      name: 'navigationMenu',
      title: 'Navigation Menu',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            {
              name: 'label',
              title: 'Menu Label',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'hasSubmenu',
              title: 'Has Submenu',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'highlight',
              title: 'Highlight',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'submenu',
              title: 'Submenu Items',
              type: 'array',
              hidden: ({ parent }: any) => !parent?.hasSubmenu,
              of: [
                {
                  type: 'object',
                  name: 'submenuItem',
                  title: 'Submenu Item',
                  fields: [
                    {
                      name: 'label',
                      title: 'Submenu Label',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'href',
                      title: 'Submenu Link URL',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'href',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
              hasSubmenu: 'hasSubmenu',
            },
            prepare(selection: any) {
              const { title, subtitle, hasSubmenu } = selection
              return {
                title: title || 'Untitled Menu Item',
                subtitle: hasSubmenu ? `${subtitle} (with submenu)` : subtitle,
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'topNavigationMenu',
      title: 'Top Navigation Menu',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            {
              name: 'label',
              title: 'Menu Label',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
           
          ],
          
        },
      ],
    }),

    defineField({
      name: 'bookfreedeomi',
      title: 'Book Free Demo',
      type: 'string',
      group: 'cta',
    }),

    defineField({
      name: 'redirectLink',
      title: 'Redirect Link',
      type: 'url',
      group: 'cta',
    }),

    defineField({
      name: 'schedulerLink',
      title: 'Scheduler Link',
      type: 'url',
      description: 'Link to redirect after successful form submission (e.g., calendar booking link)',
      group: 'cta',
    }),

    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'language',
      language: 'language',
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title}`,
        media: <img src={showCountryFlag(selection?.language)}/>
      }
    },
  },
})
