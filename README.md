<!-- HEADER SECTION -->
<h1 align="center" style="font-family:Arial, sans-serif;">
  Figma Product & Content Integration Server
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Server-green.svg" alt="Node.js Server">
  <img src="https://img.shields.io/badge/TypeScript-Powered-blue.svg" alt="TypeScript Powered">
  <img src="https://img.shields.io/badge/AI-Integration-orange.svg" alt="AI Integration">
  <img src="https://img.shields.io/badge/Figma-Plugin_Support-purple.svg" alt="Figma Plugin Support">
</p>

<!-- TABLE OF CONTENTS -->
<h2>Table of Contents</h2>

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Server Functionality](#server-functionality)
- [API Endpoints](#api-endpoints)
- [Integration with Gridline v2 Figma Plugin](#integration-with-gridline-v2-figma-plugin)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)

<hr/>

<!-- INTRODUCTION SECTION -->
<h2 id="introduction" style="font-family:Arial, sans-serif;">Introduction</h2>
<p style="font-family:Arial, sans-serif;">
The Figma Product & Content Integration Server is a sophisticated Node.js application designed to support the Gridline v2 Figma plugin. This server acts as a bridge between e-commerce platforms, AI services, and the Figma design environment, enabling seamless integration of product data and AI-generated content into design workflows.
</p>

<!-- KEY FEATURES SECTION -->
<h2 id="key-features" style="font-family:Arial, sans-serif;">Key Features</h2>
<ul style="font-family:Arial, sans-serif;">
  <li><strong>Product Data Fetching:</strong> Retrieves detailed product information from VTEX-based e-commerce platforms using GraphQL queries.</li>
  <li><strong>AI-Powered Copy Generation:</strong> Utilizes Replicate AI to create custom product descriptions and marketing copy based on user-defined prompts.</li>
  <li><strong>Chatbot Functionality:</strong> Implements an AI-driven chatbot for handling user queries and providing assistance within the Figma plugin.</li>
  <li><strong>Batch Processing:</strong> Capable of handling multiple product URLs simultaneously, supporting efficient workflow for large catalogs.</li>
  <li><strong>Dynamic Content Generation:</strong> Supports the creation of varied content through "Magic Notes" and color randomization features.</li>
</ul>

<!-- PROJECT STRUCTURE SECTION -->
<h2 id="project-structure" style="font-family:Arial, sans-serif;">Project Structure</h2>
<pre style="font-family: 'Courier New', Courier, monospace;  padding: 10px; border-radius: 5px;">
project-root/
│
├── src/
│   ├── server.ts             # Main server file
│   ├── controller.ts         # Request handling logic
│   ├── service.ts            # Core business logic for product data
│   ├── replicateService.ts   # Replicate AI integration for copy generation
│   ├── collectionService.ts  # Collection data management
│   └── types.ts              # TypeScript type definitions
│
├── dist/                     # Compiled JavaScript files
│
├── node_modules/             # npm packages
│
├── temp/                     # Temporary data storage
│
├── package.json              # npm configuration
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment settings
└── .env                      # Environment variables
</pre>

<!-- SETUP AND INSTALLATION SECTION -->
<h2 id="setup-and-installation" style="font-family:Arial, sans-serif;">Setup and Installation</h2>
<ol style="font-family:Arial, sans-serif;">
  <li>Clone the repository:
    <pre><code>git clone https://github.com/CorporateAgent/Proj-Gridline-v2.git
cd project-root</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Create a <code>.env</code> file with the following content:
    <pre><code>PORT=8080
REPLICATE_API_TOKEN=your_replicate_api_token
GROQ_KEY=your_groq_api_key</code></pre>
  </li>
  <li>Build the TypeScript files:
    <pre><code>npm run build</code></pre>
  </li>
  <li>Start the server:
    <pre><code>npm start</code></pre>
  </li>
</ol>

<!-- SERVER FUNCTIONALITY SECTION -->
<h2 id="server-functionality" style="font-family:Arial, sans-serif;">Server Functionality</h2>
<ul style="font-family:Arial, sans-serif;">
  <li><strong>Product Data Processing:</strong> Fetches and processes product information from VTEX-based e-commerce platforms.</li>
  <li><strong>AI-Powered Copy Generation:</strong> Generates custom product descriptions and marketing copy using Replicate AI.</li>
  <li><strong>Chatbot Integration:</strong> Provides an AI-driven chatbot endpoint for handling user queries within the Figma plugin.</li>
  <li><strong>Batch URL Processing:</strong> Handles multiple product URLs in a single request, supporting efficient workflows.</li>
</ul>

<!-- API ENDPOINTS SECTION -->
<h2 id="api-endpoints" style="font-family:Arial, sans-serif;">API Endpoints</h2>
<table style="font-family:Arial, sans-serif; width:100%; border-collapse: collapse;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Endpoint</th>
    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Method</th>
    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><code>/process-data</code></td>
    <td style="border: 1px solid #ddd; padding: 8px;">POST</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Processes product data and generates copy based on provided URLs and prompts</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;"><code>/chat</code></td>
    <td style="border: 1px solid #ddd; padding: 8px;">POST</td>
    <td style="border: 1px solid #ddd; padding: 8px;">Handles chatbot functionality for user assistance</td>
  </tr>
</table>

<!-- INTEGRATION WITH GRIDLINE V2 FIGMA PLUGIN SECTION -->
<h2 id="integration-with-gridline-v2-figma-plugin" style="font-family:Arial, sans-serif;">Integration with Gridline v2 Figma Plugin</h2>
<p style="font-family:Arial, sans-serif;">
The server is designed to work seamlessly with the Gridline v2 Figma plugin, supporting its key features:
</p>
<ul style="font-family:Arial, sans-serif;">
  <li><strong>Automatic Data Application:</strong> Provides product data for the plugin to populate Figma designs.</li>
  <li><strong>AI-Powered Copy Generation:</strong> Generates custom copy based on "Magic Note" prompts from the plugin.</li>
  <li><strong>Batch Processing:</strong> Supports processing of multiple product URLs for efficient workflow.</li>
  <li><strong>Chatbot Support:</strong> Offers an AI assistant interface within the plugin for user queries.</li>
</ul>

<!-- ENVIRONMENT VARIABLES SECTION -->
<h2 id="environment-variables" style="font-family:Arial, sans-serif;">Environment Variables</h2>
<ul style="font-family:Arial, sans-serif;">
  <li><code>PORT</code>: The port on which the server will run (default: 8080)</li>
  <li><code>REPLICATE_API_TOKEN</code>: API token for the Replicate AI service</li>
  <li><code>GROQ_KEY</code>: API key for the Groq service (used for chatbot functionality)</li>
</ul>

<!-- DEPLOYMENT SECTION -->
<h2 id="deployment" style="font-family:Arial, sans-serif;">Deployment</h2>
<p style="font-family:Arial, sans-serif;">
The server is configured for deployment on Vercel:
</p>
<ol style="font-family:Arial, sans-serif;">
  <li>Install the Vercel CLI: <code>npm i -g vercel</code></li>
  <li>Run <code>vercel</code> in the project root directory</li>
  <li>Follow the prompts to complete the deployment</li>
  <li>Set the required environment variables in the Vercel dashboard</li>
</ol>

<!-- TESTING SECTION -->
## Testing

Use the following cURL commands to test the server endpoints:

```bash
# Test the Chat Endpoint
curl -X POST http://localhost:8080/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "How do I use the Gridline v2 plugin?"}'
```

```bash
# Test the Product Data Endpoint
curl -X POST http://localhost:8080/process-data \
     -H "Content-Type: application/json" \
     -d '{
       "products": ["https://www.example.com/product/item123"],
       "prompts": {
         "text": "Write a compelling product description",
         "system_prompt": "You are a professional copywriter specializing in e-commerce."
       }
     }'
```

## Code Deep Dive

This section provides an overview of the core functions and libraries used in the Figma Product & Content Integration Server.

### Core Libraries

1. **Express**: Used for creating the web server and handling HTTP requests.
2. **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
3. **dotenv**: For loading environment variables from a .env file.
4. **Groq SDK**: Used for AI-powered chatbot functionality.
5. **Replicate**: Integrated for AI-powered copy generation.

### Core Functions

1. **processProducts** (`src/service.ts`)
   - Fetches and processes product data from provided URLs.
   - Handles batch processing of multiple product URLs.
   - Important internal functions:
     - `extractSkuId`: Extracts SKU ID from product URL.
     - `fetchProductData`: Retrieves product data using GraphQL query.

2. **generateCopy** (`src/replicateService.ts`)
   - Generates AI-powered copy using the Replicate API.
   - Implements retry logic and error handling.
   - Important internal operations:
     - `replicate.stream`: Streams the response from Replicate API.
     - `delay`: Implements delay between retries.

3. **generateCopyForPrompts** (`src/server.ts`)
   - Orchestrates copy generation for multiple prompts.
   - Measures and logs performance metrics.
   - Key operation:
     - Iterates through prompts and calls `generateCopy` for each.

4. **Main API Endpoint Handler** (`src/server.ts`)
   - Handles the main `/process-data` POST request.
   - Coordinates product processing and copy generation.
   - Key operations:
     - Calls `processProducts` for product data.
     - Calls `generateCopyForPrompts` for copy generation.

5. **Chatbot Endpoint Handler** (`src/server.ts`)
   - Handles the `/chat` POST request for AI-powered chat functionality.
   - Utilizes the Groq SDK for processing chat messages.
   - Key operation:
     - Uses `groq.chat.completions.create` for generating responses.

### Error Handling and Logging

- Implements structured logging using JSON format.
- Provides detailed error messages and stack traces.
- Logs performance metrics for various operations.

### Configuration and Environment

Uses environment variables for configuration, including:
- `PORT`: Server port
- `REPLICATE_API_TOKEN`: Replicate API token
- `GROQ_KEY`: Groq API key for chatbot functionality

These core components enable the server's key features: product data processing, AI-powered copy generation, and chatbot functionality.

---
