const { createClient } = require("@sanity/client");
const groq = require("groq");

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const sanityWithToken = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const PRODUCTS_FLAT = groq`*[_type == "product"].products[]{
  _id, 
  "id": coalesce(id, _key),
  title,
  "slug": slug.current,
  description,
  details[]{
    ...,
    children[]{
      ...,
      _type == "span" => { text }
    },
    _type == "image" => {
      ...,
      asset->{ _id, url },
      alt
    }
  },
  price,
    "originalPrice": select(defined(originalPrice) => originalPrice, defined(origianlprice) => origianlprice),
  inStock,
  sku,
  images[]{
    asset->{ _id, url }
  },
  colors,
  sizes[]{
    title,
    images[]{
      asset->{ _id, url }
    }
  },
  category->{ _id, title },
  isTrending,
  isFeatured,
  isNewArrival,
  rating,
  tags
}`;

module.exports = { sanity, sanityWithToken, PRODUCTS_FLAT };
