import { shopifyFetch } from '../services/shopify/client.js';

// Product Fragment for consistent product data
export const ProductFragment = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
    }
  }
`;

// Get multiple products
export const GET_PRODUCTS_QUERY = `
  ${ProductFragment}
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
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
`;

// Get a single product by handle
export const GET_PRODUCT_QUERY = `
  ${ProductFragment}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
`;

// Get product recommendations
export const QUERY_PRODUCT_RECOMMENDATIONS = `
  ${ProductFragment}
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
`;

// Fetch multiple products
export async function getProducts({ first = 20, query = '', sortKey = 'BEST_SELLING', reverse = false } = {}) {
  const response = await shopifyFetch({
    query: GET_PRODUCTS_QUERY,
    variables: { first, query, sortKey, reverse },
  });

  return response.data.products.edges.map(edge => edge.node);
}

// Fetch a single product by handle
export async function getProduct(handle) {
  const response = await shopifyFetch({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  });

  return response.data.product;
}

// Fetch product recommendations
export async function getProductRecommendations(productId) {
  const response = await shopifyFetch({
    query: QUERY_PRODUCT_RECOMMENDATIONS,
    variables: { productId },
  });

  return response.data.productRecommendations || [];
}
