"use strict";
// collectionService.ts
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
exports.fetchCollectionData = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function fetchCollectionData(productUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const productIdMatch = productUrl.match(/https:\/\/bash\.com\/(\d{4})\?map=productClusterIds/);
        if (!productIdMatch) {
            throw new Error('Invalid product URL or missing product ID.');
        }
        const productId = productIdMatch[1];
        const graphqlQuery = `
        query Request {
            productSearch( 
                hideUnavailableItems: true,
                selectedFacets: { key: "productClusterIds", value: "${productId}" }
            ) @context(provider: "vtex.search-graphql@0.62.0") {
                recordsFiltered
                products {
                    productName
                    brand
                    priceRange { sellingPrice { lowPrice } }
                    description
                    items(filter: FIRST_AVAILABLE) { images { imageUrl } }
                    categoryTree { href }
                }
            }
        }
    `;
        const response = yield (0, node_fetch_1.default)('https://thefoschini.myvtex.com/_v/segment/graphql/v1/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: graphqlQuery })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Assuming the JSON response is directly usable
    });
}
exports.fetchCollectionData = fetchCollectionData;
