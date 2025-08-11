import {defineType, defineField} from 'sanity'

export const getConsultant = defineType({
  name: 'getConsultant',
  title: 'Get Consultant',
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small text above the main heading (e.g., All the best item for You)',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Main heading text (e.g., Trust Us To Be There...)',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Text to display on the button (e.g., GET A CONSULTANT)',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      description: 'URL for the button',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      description: 'Background image for the section',
    }),
  ],
})
