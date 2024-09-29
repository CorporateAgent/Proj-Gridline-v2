import Replicate from "replicate";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Replicate with the API token from .env
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Helper function to introduce a delay (used for throttling and retry backoff)
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Define a function to generate copy using the Replicate API with retry and additional error handling
async function generateCopy(prompt: string, systemPrompt: string, retries = 3): Promise<string> {
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
    const delayBetweenRetries = 2000;  // 2 seconds delay between retries

    while (attempt < retries) {
        try {
            result = '';  // Reset the result before each attempt

            // Log the request body to ensure it is properly formatted
            console.log("Sending request with body:", JSON.stringify(input));

            // Stream the response from the Replicate API
            for await (const event of replicate.stream("mistralai/mistral-7b-instruct-v0.2", { input })) {
                result += event.toString();
            }

            // Check if the result is empty or contains the "Invalid JSON format from AI" error
            if (!result) {
                throw new Error("Received an invalid or empty response from the AI.");
            }

            console.log("Raw response received from the API:", result);

            // Return the result directly as the copy
            return result.trim();  // Trim the response to ensure no unnecessary whitespace

        } catch (error: any) {
            attempt++;
            console.error(`Attempt ${attempt} failed. Error:`, error.message);

            // Handle 400 Bad Request error
            if (error.status === 400) {
                console.error(`Bad Request: ${error.message}. Please check if the input body is correct.`);
                throw error;  // Exit early if the request format is invalid
            }

            // Handle rate limit errors (429 status code) and retry if needed
            if (error.status === 429) {
                console.error('Rate limit hit. Retrying after delay...');
                await delay(2000);  // Wait for 2 seconds before retrying
            } else if (error.message.includes("invalid or empty response")) {
                console.error('Invalid or empty response. Retrying...');
                await delay(delayBetweenRetries);  // Wait before retrying
            } else {
                // For other errors, retry if retries are available
                if (attempt >= retries) {
                    throw new Error(`Failed to generate copy after ${retries} attempts: ${error.message}`);
                }
            }
        }
    }

    throw new Error("Failed to generate copy after maximum retry attempts.");
}

export { generateCopy };