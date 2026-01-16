import { shopifyFetch, SHOPIFY_STORE_DOMAIN } from '../services/shopify/client.js';

// Cart Fragment for consistent cart data
const CartFragment = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
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
              product {
                id
                title
                handle
                vendor
              }
            }
          }
        }
      }
    }
  }
`;

// Create a new cart
export const CREATE_CART_MUTATION = `
  ${CartFragment}
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Add lines to cart
export const ADD_CART_LINES_MUTATION = `
  ${CartFragment}
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update cart lines
export const UPDATE_CART_LINES_MUTATION = `
  ${CartFragment}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Remove lines from cart
export const REMOVE_CART_LINES_MUTATION = `
  ${CartFragment}
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Get cart by ID
export const GET_CART_QUERY = `
  ${CartFragment}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`;

// Create a new cart (optionally with initial items)
export async function createCart(lines = []) {
  const response = await shopifyFetch({
    query: CREATE_CART_MUTATION,
    variables: { lines: lines.length > 0 ? lines : null },
  });

  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(response.data.cartCreate.userErrors[0].message);
  }

  return response.data.cartCreate.cart;
}

// Add items to cart
export async function addCartLines(cartId, lines) {
  const response = await shopifyFetch({
    query: ADD_CART_LINES_MUTATION,
    variables: { cartId, lines },
  });

  if (response.data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.data.cartLinesAdd.userErrors[0].message);
  }

  return response.data.cartLinesAdd.cart;
}

// Update cart line quantities
export async function updateCartLines(cartId, lines) {
  const response = await shopifyFetch({
    query: UPDATE_CART_LINES_MUTATION,
    variables: { cartId, lines },
  });

  if (response.data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.data.cartLinesUpdate.userErrors[0].message);
  }

  return response.data.cartLinesUpdate.cart;
}

// Remove items from cart
export async function removeCartLines(cartId, lineIds) {
  const response = await shopifyFetch({
    query: REMOVE_CART_LINES_MUTATION,
    variables: { cartId, lineIds },
  });

  if (response.data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(response.data.cartLinesRemove.userErrors[0].message);
  }

  return response.data.cartLinesRemove.cart;
}

// Get cart by ID
export async function getCart(cartId) {
  const response = await shopifyFetch({
    query: GET_CART_QUERY,
    variables: { cartId },
  });

  return response.data.cart;
}

// Redirect to Shopify checkout
export function redirectToCheckout(checkoutUrl) {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  }
}
