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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCopy = void 0;
const replicate_1 = __importDefault(require("replicate"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Initialize Replicate with the API token from .env
const replicate = new replicate_1.default({
    auth: process.env.REPLICATE_API_TOKEN,
});
// Helper function to introduce a delay (used for throttling and retry backoff)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Define a function to generate copy using the Replicate API with retry and additional error handling
function generateCopy(prompt, systemPrompt, retries = 3) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the prompt or system prompt is empty
        if (!prompt || !systemPrompt) {
            console.log("Prompt or system prompt is empty. Skipping copy generation.");
            // Return an empty string
            return "";
        }
        // Add the instruction to the system prompt for returning a single string of text
        const updatedSystemPrompt = `${systemPrompt} The response should be clear, concise, and in natural language. Return the response as a single string.`;
        const input = {
            top_k: 50,
            top_p: 0.9,
            prompt: prompt,
            temperature: 0.6,
            system_prompt: updatedSystemPrompt,
            length_penalty: 1,
            max_new_tokens: 512,
            presence_penalty: 0,
        };
        let result = '';
        let attempt = 0;
        const delayBetweenRetries = 2000; // 2 seconds delay between retries
        while (attempt < retries) {
            try {
                result = ''; // Reset the result before each attempt
                // Log the request body to ensure it is properly formatted
                console.log("Sending request with body:", JSON.stringify(input));
                try {
                    // Stream the response from the Replicate API
                    for (var _d = true, _e = (e_1 = void 0, __asyncValues(replicate.stream("mistralai/mistral-7b-instruct-v0.2", { input }))), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const event = _c;
                            result += event.toString();
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Check if the result is empty or contains the "Invalid JSON format from AI" error
                if (!result) {
                    throw new Error("Received an invalid or empty response from the AI.");
                }
                console.log("Raw response received from the API:", result);
                // Return the result directly as the copy
                return result.trim(); // Trim the response to ensure no unnecessary whitespace
            }
            catch (error) {
                attempt++;
                console.error(`Attempt ${attempt} failed. Error:`, error.message);
                // Handle 400 Bad Request error
                if (error.status === 400) {
                    console.error(`Bad Request: ${error.message}. Please check if the input body is correct.`);
                    throw error; // Exit early if the request format is invalid
                }
                // Handle rate limit errors (429 status code) and retry if needed
                if (error.status === 429) {
                    console.error('Rate limit hit. Retrying after delay...');
                    yield delay(2000); // Wait for 2 seconds before retrying
                }
                else if (error.message.includes("invalid or empty response")) {
                    console.error('Invalid or empty response. Retrying...');
                    yield delay(delayBetweenRetries); // Wait before retrying
                }
                else {
                    // For other errors, retry if retries are available
                    if (attempt >= retries) {
                        throw new Error(`Failed to generate copy after ${retries} attempts: ${error.message}`);
                    }
                }
            }
        }
        throw new Error("Failed to generate copy after maximum retry attempts.");
    });
}
exports.generateCopy = generateCopy;
