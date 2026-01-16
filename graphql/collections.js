import { shopifyFetch } from '../services/shopify/client.js';
import { ProductFragment } from './products.js';

// Get all collections
export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Get products in a collection
export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${ProductFragment}
  query GetCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFragment
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Fetch all collections
export async function getCollections(first = 50) {
  const response = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  return response.data.collections.edges.map(edge => edge.node);
}

// Fetch products in a collection by handle
export async function getCollectionProducts(handle, { first = 50, sortKey = 'BEST_SELLING', reverse = false } = {}) {
  const response = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, sortKey, reverse },
  });

  const collection = response.data.collection;
  if (!collection) return null;

  return {
    ...collection,
    products: collection.products.edges.map(edge => edge.node),
  };
}
