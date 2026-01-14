import { SlugValidationContext } from "sanity";
import showCountryFlag from "~/components/utils/common";
import { isUniqueAcrossAllDocuments, isUniqueOtherThanLanguage } from "~/lib/sanity";
import { apiVersion } from "~/lib/sanity.api";

export default {
  name: 'footer',
  title: 'Footer',
  type: 'document',
  // This ensures the page works with document internationalization
  i18n: true,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    
    // CTA Banner Section
    {
      name: 'ctaBanner',
      title: 'CTA Banner',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Banner Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Banner Description',
          type: 'text',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
        },
        {
          name: 'showBanner',
          title: 'Show Banner',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }
      ]
    },

    // Footer Columns
    {
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          title: 'Footer Column',
          fields: [
            {
              name: 'title',
              title: 'Column Title',
              type: 'string'
            },
            
            {
              name: 'titleLink',
              title: 'Title Link URL',
              type: 'string'
            },
            {
              name: 'links',
              title: 'Column Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'footerLink',
                  title: 'Footer Link',
                  fields: [
                    {
                      name: 'text',
                      title: 'Link Text',
                      type: 'string'
                    },
                    {
                      name: 'link',
                      title: 'Link URL',
                      type: 'string'
                    },
                    {
                      name: 'newTab',
                      title: 'Open In New Tab',
                      type: 'boolean',
                      initialValue: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // Social Media Links
    {
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'string'
        },
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'string'
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'string'
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'string'
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'string'
        }
      ]
    },

    // App Store Links
    {
      name: 'appStoreLinks',
      title: 'App Store Links',
      type: 'object',
      fields: [
        {
          name: 'googlePlay',
          title: 'Google Play Store URL',
          type: 'string'
        },
        {
          name: 'appStore',
          title: 'Apple App Store URL',
          type: 'string'
        },
        {
          name: 'googlePlayIcon',
          title: 'Google Play Store Icon',
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          name: 'appStoreIcon',
          title: 'Apple App Store Icon',
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },

    // Bottom Footer Links
    {
      name: 'bottomLinks',
      title: 'Bottom Footer Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bottomLink',
          title: 'Bottom Footer Link',
          fields: [
            {
              name: 'text',
              title: 'Link Text',
              type: 'string'
            },
            {
              name: 'link',
              title: 'Link URL',
              type: 'string'
            },
            {
              name: 'newTab',
              title: 'Open In New Tab',
              type: 'boolean',
              initialValue: false
            }
          ]
        }
      ]
    },

    // Copyright Text
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: 'VoiceStack'
    },

    // Company Logo
    {
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string'
        }
      ]
    },
    
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }
  ],
  preview: {
      select: {
        title: 'title',
        language:'language',
      },
      prepare(selection) {
        return {
          title: ` ${selection?.title}`,
          media:<img src={showCountryFlag(selection?.language)}/>
        };
      },
    },
}

