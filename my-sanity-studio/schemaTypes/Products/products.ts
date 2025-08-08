import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'products',
      title: 'Products',
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
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
              },
            }),
            defineField({
              name: 'description',
              title: 'Short Description',
              type: 'text',
            }),
            defineField({
              name: 'details',
              title: 'Product Details',
              type: 'array',
              of: [{type: 'block'}],
            }),
            defineField({
              name: 'price',
              title: 'Sale Price',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'originalPrice',
              title: 'Original Price',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'inStock',
              title: 'Stock Quantity',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
            }),
            defineField({
              name: 'images',
              title: 'Product Images',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}}],
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'colors',
              title: 'Available Colors',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'sizes',
              title: 'Available Sizes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'sizeOption',
                  title: 'Size Option',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Size Title',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'images',
                      title: 'Images for this Size',
                      type: 'array',
                      of: [
                        {
                          type: 'image',
                          options: {hotspot: true},
                        },
                      ],
                      validation: (Rule) => Rule.min(1),
                    }),
                  ],
                },
              ],
            }),
            defineField({
              name: 'categories',
              title: 'Product Categories',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{type: 'category'}],
                },
              ],
              //   validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'isTrending',
              title: 'Trending Product',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'isFeatured',
              title: 'Featured Product',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'isNewArrival',
              title: 'New Arrival',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'rating',
              title: 'Rating (out of 5)',
              type: 'number',
              validation: (rule) => rule.min(0).max(5),
            }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        },
      ],
    }),
  ],
})
