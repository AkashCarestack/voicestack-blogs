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
      name: 'contact',
      title: 'Contact Info',
    },
    {
      name: 'cta',
      title: 'CTA',
    },
    {
      name: 'form',
      title: 'Form',
    },
    {
      name: 'demoForms',
      title: 'Demo Forms',
    },
    {
      name: 'pricingDemoForms',
      title: 'Pricing Demo Forms',
    },
    {
      name: 'schema',
      title: 'Schema',
    },
  ],
  fields: [
    // Hero fields from shared schema
    ...heroFields.map(field => ({
      ...field,
      group: 'hero',
    })),

    defineField({
      name: 'demoFormId',
      title: 'Demo Form Id',
      type: 'string',
      group: 'form',
      
    }),
    
    defineField({
      name: 'demoMeetingLink',
      title: 'Demo Meeting Link',
      type: 'string',
      group: 'form',
    }),
    
    defineField({
      name: 'dmeoFormEventName',
      title: 'Demo Form Event Name',
      type: 'string',
      group: 'form',
    }),

    defineField({
      name: 'demoForms',
      title: 'Demo Forms',
      type: 'array',
      group: 'demoForms',
      of: [
        {
          type: 'object',
          name: 'demoFormItem',
          title: 'Demo Form',
          fields: [
            {
              name: 'practiceType',
              title: 'Practice Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Dental', value: 'Dental' },
                  { title: 'Optometry', value: 'Optometry' },
                  { title: 'Physical Therapy', value: 'Physical Therapy' },
                  { title: 'Veterinary', value: 'Veterinary' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'demoFormId',
              title: 'Demo Form Id',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'demoMeetingLink',
              title: 'Demo Meeting Link',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'practiceType',
              subtitle: 'demoFormId',
            },
            prepare(selection: any) {
              const { title, subtitle } = selection
              return {
                title: title || 'Untitled Demo Form',
                // subtitle: subtitle || 'No Form ID',
              }
            },
          },
        },
      ],
    }),

    defineField({
      name: 'pricingDemoForms',
      title: 'Pricing Demo Forms',
      type: 'array',
      group: 'pricingDemoForms',
      of: [
        {
          type: 'object',
          name: 'demoFormItem',
          title: 'Demo Form',
          fields: [
            {
              name: 'practiceType',
              title: 'Practice Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Dental', value: 'Dental' },
                  { title: 'Optometry', value: 'Optometry' },
                  { title: 'Physical Therapy', value: 'Physical Therapy' },
                  { title: 'Veterinary', value: 'Veterinary' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'demoFormId',
              title: 'Demo Form Id',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'demoMeetingLink',
              title: 'Demo Meeting Link',
              type: 'string',
              // validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'practiceType',
              subtitle: 'demoFormId',
            },
            prepare(selection: any) {
              const { title, subtitle } = selection
              return {
                title: title || 'Untitled Demo Form',
                // subtitle: subtitle || 'No Form ID',
              }
            },
          },
        },
      ],
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
      
      group: 'contact',
    }),
    defineField({
      name: 'supportPhoneNumber',
      title: 'Support Phone Number',
      type: 'string',
      description:'Support phone number',
      group: 'contact',
    }),
        
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:'Support email',
      group: 'contact',
    }),

    defineField({
      name: 'salesEmail',
      title: 'Sales Email',
      type: 'string',
      description:'Sales email',
      group: 'contact',
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
                  name: 'submenuGroup',
                  title: 'Submenu Group',
                  fields: [
                    {
                      name: 'submenuHeader',
                      title: 'Submenu Header',
                      type: 'string',
                      description: 'Header text for this group of submenu items',
                    },
                    {
                      name: 'items',
                      title: 'Submenu Items',
                      type: 'array',
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
                      header: 'submenuHeader',
                      items: 'items',
                    },
                    prepare(selection: any) {
                      const { header, items } = selection;
                      const itemCount = items?.length || 0;
                      return {
                        title: header || 'Untitled Group',
                        subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
                      };
                    },
                  },
                },
              ],
            },
            {
              name: 'specialMenu',
              title: 'Special Menu (Right Side)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'specialMenuItem',
                  title: 'Special Menu Item',
                  fields: [
                    {
                      name: 'heading',
                      title: 'Heading',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    },
                    {
                      name: 'link',
                      title: 'Link URL',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    },
                  ],
                  preview: {
                    select: {
                      title: 'heading',
                      subtitle: 'description',
                      media: 'image',
                    },
                  },
                },
              ],
            },
            {
              name: 'bottomCustomLinks',
              title: 'Bottom Custom Links',
              type: 'array',
              hidden: ({ parent }: any) => !parent?.hasSubmenu,
              of: [
                {
                  type: 'object',
                  name: 'customLink',
                  title: 'Custom Link',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
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
    defineField({
      name: 'schema',
      title: 'Schema',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'schemaItem',
          title: 'Schema Item',
          fields: [
            {
              name: 'name',
              title: 'Schema Key (do not change this key this key is used to identify the schema)',
              type: 'string',
              options: {
                list: [
                  { title: 'OrganizationSchema', value: 'OrganizationSchema' },
                  { title: 'SoftwareApplicationSchema', value: 'SoftwareApplicationSchema' },
                ],
              },
            },
            {
              name: 'value',
              title: 'Value',
              type: 'text',
            },
          ]
        }
      ],
      group: 'schema',
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
