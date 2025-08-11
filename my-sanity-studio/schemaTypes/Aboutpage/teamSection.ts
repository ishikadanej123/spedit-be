import {defineType, defineField, defineArrayMember} from 'sanity'

export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small label above the main title (e.g., Members)',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'members',
      title: 'Team Members',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamMember',
          title: 'Team Member',
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
              title: 'Role',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'facebook',
              title: 'Facebook URL',
              type: 'url',
              description: 'Link to Facebook profile',
            }),
            defineField({
              name: 'linkedin',
              title: 'LinkedIn URL',
              type: 'url',
              description: 'Link to LinkedIn profile',
            }),
            defineField({
              name: 'instagram',
              title: 'Instagram URL',
              type: 'url',
              description: 'Link to Instagram profile',
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule.min(1).max(10).error('You must have between 1 and 10 team members.'),
    }),
  ],
})
