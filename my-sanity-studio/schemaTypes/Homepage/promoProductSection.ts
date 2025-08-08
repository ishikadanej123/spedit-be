import {defineField, defineType} from 'sanity'

export const promoProductSection = defineType({
  name: 'promoProductSection',
  title: 'Promo Product Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'products',
      title: 'Promo Products',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productCard',
          title: 'Product Card',
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (rule) => rule.required().positive(),
            }),
            defineField({
              name: 'currency',
              title: 'Currency Symbol',
              type: 'string',
              initialValue: '$',
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Shop Now',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              description: 'Enter internal route like /shop or /product/[slug]',
              // validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'image',
              title: 'Product Image',
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
              description: 'Optional hex or Tailwind class (e.g. #f2f2f2 or bg-sky-100)',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1).error('At least one product card is required.'),
    }),
  ],
})
