import {defineType} from 'sanity'

export const pageSections = defineType({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: [
    {type: 'heroBanner'},
    {type: 'promoBanner'},
    {type: 'promoProductSection'},
    {type: 'dealOfTheDayBanner'},
    {type: 'promoSection'},
    {type: 'sellingBanner'},
  ],
})
