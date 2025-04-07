/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import {languageFilter} from '@sanity/language-filter'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import { deskTool } from 'sanity/desk'
import {
  defineUrlResolver,
  Iframe,
  IframeOptions,
} from 'sanity-plugin-iframe-pane'
import { previewUrl } from 'sanity-plugin-iframe-pane/preview-url'
import {documentInternationalization} from '@sanity/document-internationalization'
import {ExpandIcon} from '@sanity/icons'
import {BoltIcon} from '@sanity/icons'
import {DesktopIcon} from '@sanity/icons'
import {EarthGlobeIcon} from '@sanity/icons'

// see https://www.sanity.io/docs/api-versioning for how versioning works
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from '~/lib/sanity.api'
import { schema } from '~/schemas'
import { media } from 'sanity-plugin-media'

const iframeOptions = {
  url: defineUrlResolver({
    base: '/api/draft',
    requiresSlug: ['post'],
  }),
  urlSecretId: previewSecretId,
  reload: { button: true },
} satisfies IframeOptions

export default defineConfig({
  basePath: '/studio',
  name: 'project-name',
  title: 'Project Name',
  projectId,
  dataset,

  //edit schemas in './src/schemas'
  schema,
  form: {
    components: {
      input: (props: any) => {
        if (Array.isArray(props.groups) && props.groups.length > 0) {
          if (props.groups[0].name === 'all-fields') {
            props.groups.shift()
          }
        }
        return props.renderDefault(props)
      },
    },
  },
  document: {
    newDocumentOptions: (prev, { currentUser, creationContext }) => {
      const { type, schemaType } = creationContext
      if (type === 'structure' && schemaType == 'siteSettings') {
        return []
      }
      return prev
    },
  },
  plugins: [
    languageFilter({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'cs', title: 'CareStack'},
        {id: 'fmc', title: 'FMC'},
        //...
      ],
      // Select Norwegian (Bokmål) by default
      defaultLanguages: ['en'],
      // Only show language filter for document type `page` (schemaType.name)
      documentTypes: ['homeSettings'],
      // filterField: (enclosingType, member, selectedLanguageIds) =>
      //   !enclosingType.name.startsWith('locale') || !enclosingType.name.startsWith('language') || selectedLanguageIds.includes(member.name),
    }),

    internationalizedArray({
      languages: [
        {id: 'default', title: 'Default'},
        {id: 'cs', title: 'CareStack'},
        {id: 'fmc', title: 'FMC'},
      ],
      defaultLanguages: ['default'],
      fieldTypes: ['string', 'customBlockContent'],
    }),
    
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'US English' },
        { id: 'en-GB', title: 'UK English' },
        { id: 'en-AU', title: 'Australia English' },
      ],
      schemaTypes: [
        'layout',
        'feature',
        'siteSettings',
        'testimonial',
        'homeSettings',
        'faq',
        'legal',
        'comparisonTable',
        'comparisonValue',
        'testimonialSection',
        'logoListing',
        'cardsListing',
        'csCardsListing',
        'platform',
        'testimonialHighlightSection',
        'banner',
        'footer',
        'page',
        'miscellaneous',
        'featureList',
        'featureCategory',
        'heroes',
        'globalSettings',
      ],
    }),

    deskTool({
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      // You can add any React component to `S.view.component` and it will be rendered in the pane
      // and have access to content in the form in real-time.
      // It's part of the Studio's “Structure Builder API” and is documented here:
      // https://www.sanity.io/docs/structure-builder-reference
      defaultDocumentNode: (S, { schemaType }) => {
        return S.document().views([
          // Default form view
          S.view.form(),
          // Preview
          S.view.component(Iframe).options(iframeOptions).title('Preview'),
        ])
      },
      structure: (S) =>
        S.list()
          .title('Base')
          .items([
            // S.listItem()
            //   .title('Home Page')
            //   .child(
            //     S.document()
            //       .schemaType('homeSettings')
            //       .documentId('homeSettings'),
            //   ),

            S.listItem()
              .title('Site Configuration')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.listItem()
              .title('Comparison Table')
              .child(
                S.document()
                  .schemaType('comparisonTable')
                  .documentId('comparisonTable'),
              ),

            // S.listItem()
            // .title('Platform')
            // .child(
            //   S.document()
            //     .schemaType('platform')
            //     .documentId('platform'),
            // ),

            S.documentTypeListItem('homeSettings').title('Home Settings'),
            S.documentTypeListItem('testimonial').title('Feature Section'),
            S.documentTypeListItem('testimonialSection').title('Testimonial'),
            // S.documentTypeListItem('feature').title('Feature'),
            S.documentTypeListItem('legal').title('Legal'),
            S.documentTypeListItem('comparisonValue').title('Comparison Value'),
            S.documentTypeListItem('platform').title('Integration List'),
            S.documentTypeListItem('platformList').title('Platform List'),
            S.documentTypeListItem('logoListing').title('logo Listing'),
            S.documentTypeListItem('cardsListing').title('Cards Listing'),
            S.documentTypeListItem('csCardsListing').title('Refer Cards Listing'),
            S.documentTypeListItem('faq').title('Faq'),
            S.documentTypeListItem('testimonialHighlightSection').title('Testimonial Highlight'),
            S.documentTypeListItem('banner').title('banner'),
            S.documentTypeListItem('footer').title('Footer'),
            S.documentTypeListItem('miscellaneous').title('Miscellaneous').icon(ExpandIcon),
            S.documentTypeListItem('page').title('Pages'),
            // S.documentTypeListItem('featureList').title('Features').icon(BoltIcon),
            S.listItem()
            .title('Features')
            .icon(BoltIcon)
            .child(
              S.list()
                .title('Grouped Features')
                .items([
                  S.listItem()
                    .title('AU Features')
                    .child(
                      S.documentList()
                        .title('AU Features')
                        .filter('_type == "featureList"  && language == "en-AU"')
                    ),
                  S.listItem()
                    .title('GB Features')
                    .child(
                      S.documentList()
                        .title('GB Features')
                        .filter('_type == "featureList"  && language == "en-GB"')
                    ),
                  S.listItem()
                    .title('US Features')
                    .child(
                      S.documentList()
                        .title('US Features')
                        .filter('_type == "featureList"  && language == "en"')
                    ),
                  S.divider(),
                  S.documentTypeListItem('featureList').title('All Features'),
                ])
            ),

            
            S.documentTypeListItem('featureCategory').title('Feature Category').icon(BoltIcon),
            S.documentTypeListItem('heroes').title('Heroes').icon(DesktopIcon),
            S.listItem()
            .title('Global Settings')
            .icon(EarthGlobeIcon)
            .child(
              S.document()
                .schemaType('globalSettings')
                .documentId('globalSettings'),
            ),

            // S.documentTypeListItem('platform').title('Platform'),
          ]),
    }),

    media({
      creditLine: {
        enabled: true,
        // boolean - enables an optional "Credit Line" field in the plugin.
        // Used to store credits e.g. photographer, licence information
        excludeSources: ['unsplash'],
        // string | string[] - when used with 3rd party asset sources, you may
        // wish to prevent users overwriting the creditLine based on the `source.name`
      },
      maximumUploadSize: 10000000,
      // number - maximum file size (in bytes) that can be uploaded through the plugin interface
    }),
    previewUrl({
      base: '/api/draft',
      requiresSlug: ['post'],
      urlSecretId: previewSecretId,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
