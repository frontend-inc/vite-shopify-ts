// Main Shopify API service that combines all functionality
export { shopifyFetch, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_URL } from './client.js';

// Product functions
export { 
  getProducts, 
  getProduct,
  getProductRecommendations,
  GET_PRODUCTS_QUERY, 
  GET_PRODUCT_QUERY,
  QUERY_PRODUCT_RECOMMENDATIONS,
  ProductFragment
} from '../../graphql/products.js';

// Collection functions
export { 
  getCollections, 
  getCollectionProducts, 
  GET_COLLECTIONS_QUERY, 
  GET_COLLECTION_PRODUCTS_QUERY 
} from '../../graphql/collections.js';

// Cart functions
export {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  redirectToCheckout,
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  GET_CART_QUERY
} from '../../graphql/cart.js';