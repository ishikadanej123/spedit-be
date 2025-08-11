import {defineType} from 'sanity'

export const aboutPageSections = defineType({
  name: 'aboutPageSections',
  title: 'About Page Sections',
  type: 'array',
  of: [
    {type: 'aboutHero'},
    {type: 'featureSection'},
    {type: 'teamSection'},
    {type: 'getConsultant'},
    {type: 'testimonialSection'},
  ],
})
