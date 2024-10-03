"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProducts = void 0;
// src/service.ts
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const tempDir = path_1.default.join(os_1.default.tmpdir(), 'your-app-name');
if (!fs_1.default.existsSync(tempDir)) {
    fs_1.default.mkdirSync(tempDir, { recursive: true });
}
function extractSlug(url) {
    const pathSegments = url.split('/');
    const slugWithQuery = pathSegments[pathSegments.length - 2]; // Get the second-to-last segment
    return slugWithQuery.split('?')[0]; // Remove any query parameters
}
function fetchProductData(slug) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const response = yield (0, node_fetch_1.default)('https://thefoschini.myvtex.com/_v/segment/graphql/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse = yield response.json(); // Use the updated type
        return jsonResponse;
    });
}
function processProducts(products) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(products.map((url, index) => __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = extractSlug(url); // Using slug instead of SKU
                console.log(`Processing URL: ${url}`); // Log the URL being processed
                const data = yield fetchProductData(slug);
                const productData = data.data.product; // Assert the type to any to bypass the error
                if (!productData) {
                    console.warn(`No product data found for slug: ${slug}`); // Log a warning if needed
                    return null; // Return null or handle as needed
                }
                // Log the product name received
                console.log(`Received product: ${productData.productName}`); // Log only the product name
                const filePath = path_1.default.join(tempDir, `product_${index + 1}.json`);
                fs_1.default.writeFileSync(filePath, JSON.stringify(productData, null, 2));
                return productData;
            }
            catch (error) {
                const errorMessage = error.message || 'Unknown error occurred'; // Safely access the message
                console.error(`Error processing URL: ${url}`, errorMessage); // Log the error with the URL
                throw new Error(`Failed to process product at ${url}: ${errorMessage}`);
            }
        })));
    });
}
exports.processProducts = processProducts;
