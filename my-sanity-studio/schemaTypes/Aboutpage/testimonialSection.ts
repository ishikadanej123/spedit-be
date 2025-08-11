import {defineType, defineField, defineArrayMember} from 'sanity'

export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small text above the main heading (e.g., testimonials)',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Main heading text (e.g., Happy Clients Says)',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          title: 'Testimonial',
          fields: [
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / Position',
              type: 'string',
            }),
            defineField({
              name: 'company',
              title: 'Company',
              type: 'string',
              description: 'Optional company name (e.g., Founder at UIHUB)',
            }),
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
              description: 'The testimonial text from the client',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).error('At least one testimonial is required'),
    }),
  ],
})
