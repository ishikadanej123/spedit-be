import {defineField, defineType} from 'sanity'

export const promoSection = defineType({
  name: 'promoSection',
  title: 'Promo Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Main heading (e.g., Grade A Safety Masks)',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Subheading (e.g., For Sale. Hurry Up!)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Paragraph describing the promo',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineField({
          name: 'feature',
          title: 'Feature',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Feature description (e.g., Express Delivery)',
            }),
          ],
          preview: {
            select: {
              title: 'text',
              media: 'icon',
            },
          },
        }),
      ],
      description: 'List of features with icon and text',
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Discover More',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      description: 'URL for the Discover More button',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
