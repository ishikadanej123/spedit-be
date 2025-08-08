import {defineField, defineType} from 'sanity'

export const promoBannerType = defineType({
  name: 'promoBanner',
  title: 'Promo Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'banner',
          title: 'Banner',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Buy Now',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'url',
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
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              description: 'Optional hex or Tailwind class (e.g. #f2f2f2 or bg-blue-100)',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1).error('At least one banner is required.'),
    }),
  ],
})
