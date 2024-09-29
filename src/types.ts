// src/types.ts
export interface Product {
    productName: string;
    brand: string;
    priceRange: {
        sellingPrice: {
            lowPrice: number;
        };
    };
    description: string;
    items: {
        images: {
            imageUrl: string;
        }[];
    }[];
    categoryTree: {
        href: string;
    }[];
}

export interface GraphQLResponse {
    data: {
        productsByIdentifier: Product[];
    };
}
