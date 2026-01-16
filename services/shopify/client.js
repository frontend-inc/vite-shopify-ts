// Shopify Storefront API Service
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-07';
const SHOPIFY_STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Shopify API request with optional access token
async function shopifyFetch({ query, variables = {} }) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add access token if available
    if (SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      headers['X-Shopify-Storefront-Access-Token'] = SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    }

    const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store', // Ensure fresh data for cart operations
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Shopify API HTTP error! Status: ${response.status}, Body: ${errorBody}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify API errors:', json.errors);
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    return json;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

export { shopifyFetch, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_API_URL };