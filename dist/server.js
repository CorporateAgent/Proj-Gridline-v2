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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
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
// Start the server on port 8080
app.listen(PORT, () => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), logType: 'Info', message: `Server running on http://localhost:${PORT}` })); // local server
});
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
