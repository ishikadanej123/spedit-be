import {defineField, defineType} from 'sanity'

export const sellingBanner = defineType({
  name: 'sellingBanner',
  title: 'Best Selling Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price',
      type: 'number',
      description: 'Strikethrough price (if discounted)',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'View More',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Internal route like /product/[slug]',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
