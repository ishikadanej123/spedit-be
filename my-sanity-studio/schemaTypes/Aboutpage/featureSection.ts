import {defineType, defineField, defineArrayMember} from 'sanity'

export const featureSection = defineType({
  name: 'featureSection',
  title: 'Feature Section',
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small label above the main title (e.g., Features)',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Feature Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featureItem',
          title: 'Feature Item',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).max(6).error('You must have between 1 and 6 features.'),
    }),
  ],
})
