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

function extractSkuId(url: string): string {
    return url.split('skuId=')[1];
}

async function fetchProductData(skuId: string): Promise<GraphQLResponse> {
    const query = `
        query {
            productsByIdentifier(field: sku, values: "${skuId}") @context(provider: "vtex.search-graphql@0.62.0") {
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

    return response.json() as Promise<GraphQLResponse>;
}

async function processProducts(products: string[]): Promise<Product[]> {
    return Promise.all(products.map(async (url, index) => {
        const skuId = extractSkuId(url);
        const data = await fetchProductData(skuId);
        const productData = data.data.productsByIdentifier[0];
        const filePath = path.join(tempDir, `product_${index + 1}.json`);
        fs.writeFileSync(filePath, JSON.stringify(productData, null, 2));
        return productData;
    }));
}

export { processProducts };