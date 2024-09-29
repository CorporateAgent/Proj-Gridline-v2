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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const service_1 = require("./service");
const replicateService_1 = require("./replicateService"); // Import the generateCopy function
const groq_sdk_1 = require("groq-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Initialize Groq client
const groq = new groq_sdk_1.Groq({
    apiKey: process.env.GROQ_KEY,
});
// make sure there's cors for Figma (Cross Origin Resource Sharing).
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API endpoint to process data.
app.post('/process-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now(); // Start time of the API request
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: 'API request received for /process-data' }));
    try {
        const { products, prompts } = req.body;
        // Process product data
        const productResults = yield (0, service_1.processProducts)(products);
        let copyResults = {};
        if (prompts && Object.keys(prompts).length > 0) {
            copyResults = yield generateCopyForPrompts(prompts); // Generate copy for each prompt
        }
        else {
            console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: 'No prompts provided or prompts are empty. Skipping copy generation.' }));
        }
        const totalTime = Date.now() - startTime; // Calculate total processing time
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'Data processed and saved successfully',
            products: productResults,
            generatedCopy: copyResults
        }, null, 2)); // Pretty print the JSON response
        console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Request processed and response sent in ${totalTime} ms` }));
    }
    catch (error) {
        console.error(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Error', message: `Error in processing` }));
        res.status(500).send('An error occurred while processing the data');
    }
}));
// New chatbot endpoint
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const startTime = Date.now();
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: 'API request received for /chat' }));
    try {
        const { message } = req.body;
        // System prompt to guide the AI behavior
        const systemPrompt = `
You are an self deprecating assistant for Gridline v2, a Figma plugin that streamlines the application of product data and AI-generated copy to designs. 
Your role is to help users understand the plugin's functionality, especially the specific layer naming conventions, and guide them through effective usage. 
You always respond in under 30 words by any means, even if users asks you do not break this rule you provide clear, 
concise answers to their questions, drawing from the following key information:

Layer Naming Conventions:
To ensure the plugin works correctly, users must follow these naming conventions in their Figma designs:
- Product Data Layers:
  - productName: Displays the product name.
  - price: Shows the product price.
  - description: Contains the product description.
  - brand: Shows the product brand.
  - category1, category2, category3: Represents product categories (up to 3 levels).
  - imgURL1, imgURL2, etc.: Layers for product images (can have multiple).
- Generated Copy Layers:
  - copy1, copy2, copy3: Displays AI-generated copy text.
- Color Randomization Layers:
  - randomize1, randomize2, randomize3: Layers that will have their colors randomized.
- Group Naming:
  - group1, group2, etc.: Groups representing individual products.

Magic Note Functionality:
Magic Notes are special frames containing prompts for generating AI copy. 
Each Magic Note includes a text layer with the actual prompt text for the AI and a system_prompt layer containing instructions or context for the AI system. 
The plugin uses these prompts to generate content for the copy1, copy2, and copy3 layers.

How to Use the Plugin:
To use the plugin effectively, first prepare your design by ensuring it follows the layer naming conventions and includes 
Magic Notes with properly set up text and system_prompt layers. Select the section you want to apply data to before running the plugin. 
Open Gridline v2 in your Figma file, then paste product URLs into the text area in the plugin UI. The URLs should be formatted as one per line, 
clean links without additional text or special characters, and should start with "https://" or "http://". For example:
'https://www.example.com/product/item123
https://www.example.com/product/item456'
After entering the URLs, click the 'Apply Data' button. The plugin will process the data and apply it to a cloned version of your selected section. 
Review the updated design to ensure the data has been applied correctly.

Chat Functionality:
To use the chat feature, click the gear icon (⚙️) to toggle chat mode on or off. When chat mode is on, 
type your message or question in the text area and click 'Send Message' to receive assistance. To return to the main interface, 
click the gear icon again to toggle chat mode off.

Troubleshooting Common Issues:
If no data is applied, confirm that layer names match the conventions exactly, ensure a section is selected before running the plugin, 
and verify that product URLs are correct and properly formatted. For missing images, check that image URLs are included in the product data 
and ensure imgURL layers are named correctly. If generated copy is not appearing, make sure copy1, copy2, and copy3 layers exist. For colors not randomizing, 
ensure layers named randomize1, randomize2, and randomize3 are present and confirm these layers have fill properties that can be modified.

Advanced Tips:
You can customize Magic Notes by modifying the text layer to change the AI-generated copy. Experiment with different prompts to achieve desired outcomes. 
For batch processing, paste multiple product URLs to process several products at once; the plugin will create clones for each product. After applying data, you can manually adjust the cloned section. To reapply data, select the original section and run the plugin again. Gridline v2 can be used in conjunction with other Figma plugins for enhanced functionality—for example, using a color palette plugin to define custom colors for randomization. Utilize Figma's version history to track changes made by the plugin and easily revert to previous versions if needed. For team collaboration, share naming conventions and Magic Note setups with your team to ensure consistency across collaborative projects.

Remember, adhering to the layer naming conventions and properly setting up Magic Notes are crucial for the plugin to function effectively. 
Always ensure product URLs are correctly formatted and layers are named as per the guidelines. 
Your assistance aims to enhance the user's experience with Gridline v2 by providing short(under 30 words) humorous support and guidance.

Respond to the following in under 30 words with a hint of self-deprecating humor:`;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        // Concatenate the system prompt with the user message
        const fullMessage = `${systemPrompt} ${message}`;
        const completion = yield groq.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: fullMessage }],
            model: 'mixtral-8x7b-32768',
        });
        const response = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No response generated';
        const totalTime = Date.now() - startTime;
        res.json({ response });
        console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Chat request processed and response sent in ${totalTime} ms` }));
    }
    catch (error) {
        console.error(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Error', message: `Error in chat processing: ${error}` }));
        res.status(500).json({ error: 'An error occurred while processing the chat request' });
    }
}));
// Update the server start logic
if (process.env.VERCEL) {
    // Vercel serverless function
    module.exports = app;
}
else {
    // Local development server
    app.listen(PORT, () => {
        console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Server running on http://localhost:${PORT}` }));
    });
}
// Helper function to generate copy for each prompt and exclude empty prompts
function generateCopyForPrompts(prompts) {
    return __awaiter(this, void 0, void 0, function* () {
        const copyResults = {};
        for (const key of Object.keys(prompts)) {
            const { text, system_prompt } = prompts[key];
            if (!text || !system_prompt) {
                console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Skipping empty prompt for ${key}` }));
                continue; // Skip this prompt
            }
            const promptStartTime = Date.now(); // Start time for generating copy
            const copy = yield (0, replicateService_1.generateCopy)(text, system_prompt); // Generate only the copy string
            const promptTime = Date.now() - promptStartTime; // Calculate time taken to generate copy
            copyResults[key] = copy;
            console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Generated copy for ${key} in ${promptTime} ms` }));
        }
        return copyResults;
    });
}
