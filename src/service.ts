// src/service.ts
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Product, GraphQLResponse } from './types';  // Importing the defined types

const tempDir = path.join(os.tmpdir(), 'your-app-name');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

function extractSlug(url: string): string {
    const pathSegments = url.split('/');
    const slugWithQuery = pathSegments[pathSegments.length - 2]; // Get the second-to-last segment
    return slugWithQuery.split('?')[0]; // Remove any query parameters
}

async function fetchProductData(slug: string): Promise<GraphQLResponse> {
    const query = `
        query {
            product(slug: "${slug}") @context(provider: "vtex.search-graphql@0.62.0") {
                productName
                brand
                priceRange { sellingPrice { lowPrice } }
                description
                items(filter: FIRST_AVAILABLE) { images { imageUrl } }
                categoryTree { href }
            }
        }
    `;

    const response = await fetch('https://thefoschini.myvtex.com/_v/segment/graphql/v1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json() as GraphQLResponse; // Use the updated type
    return jsonResponse;
}

async function processProducts(products: string[]): Promise<Product[]> {
    return Promise.all(products.map(async (url, index) => {
        try {
            const slug = extractSlug(url); // Using slug instead of SKU
            console.log(`Processing URL: ${url}`); // Log the URL being processed
            const data = await fetchProductData(slug);
            
            const productData = (data.data as any).product; // Assert the type to any to bypass the error
            
            if (!productData) {
                console.warn(`No product data found for slug: ${slug}`); // Log a warning if needed
                return null; // Return null or handle as needed
            }

            // Log the product name received
            console.log(`Received product: ${productData.productName}`); // Log only the product name

            const filePath = path.join(tempDir, `product_${index + 1}.json`);
            fs.writeFileSync(filePath, JSON.stringify(productData, null, 2));
            return productData;
        } catch (error) {
            const errorMessage = (error as Error).message || 'Unknown error occurred'; // Safely access the message
            console.error(`Error processing URL: ${url}`, errorMessage); // Log the error with the URL
            throw new Error(`Failed to process product at ${url}: ${errorMessage}`);
        }
    }));
}

export { processProducts };