const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://localhost:11434/api/generate';

app.use(cors());
app.use(express.json());

// 1. Convert Endpoint (Proxy to Ollama)
app.post('/convert', async (req, res) => {
    const { sourceCode } = req.body;
    
    if (!sourceCode) {
        return res.status(400).json({ error: "No source code provided" });
    }

    const systemPrompt = `You are an expert SDET and Automation Engineer. Your task is to convert Selenium Java TestNG code into Playwright TypeScript.
    
    RULES:
    1. Output ONLY the TypeScript code. Do not include markdown backticks or explanations.
    2. Use the standard 'test' and 'expect' from '@playwright/test'.
    3. Convert @Test to test('name', async ({page}) => {}).
    4. Convert @BeforeClass to test.beforeAll().
    5. Convert driver.findElement to page.locator.
    6. Convert Assert.assertEquals to expect().toBe().
    7. Retain the logic but make it idiomatic TypeScript.
    
    INPUT JAVA CODE:
    ${sourceCode}
    `;

    try {
        console.log("Sending request to Ollama...");
        const response = await axios.post(OLLAMA_URL, {
            model: "codellama",
            prompt: systemPrompt,
            stream: false
        });

        if (response.data && response.data.response) {
            res.json({ convertedCode: response.data.response });
        } else {
            console.error("Unexpected Ollama response:", response.data);
            res.status(500).json({ error: "Invalid response from Ollama" });
        }

    } catch (error) {
        console.error("Ollama Error:", error.message);
        res.status(500).json({ error: "Failed to connect to Ollama. Is it running?" });
    }
});

// 2. Save Endpoint
app.post('/save', (req, res) => {
    const { content, directory, filename } = req.body;
    
    if (!content || !filename) {
        return res.status(400).json({ error: "Missing content or filename" });
    }

    const targetDir = directory || path.join(__dirname, '../output'); // Default to ../output
    const fullPath = path.join(targetDir, filename);

    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content);
        res.json({ success: true, path: fullPath });
        console.log(`Saved file to: ${fullPath}`);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save file" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
