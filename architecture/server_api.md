# 🔌 Architecture: Server API
Last Updated: 2026-02-01

## 📌 Overview
Local Express Server running on Port `3001`. Acts as a bridge between the React frontend and the local file system + Ollama.

## 🛣️ Endpoints

### 1. `POST /convert`
**Purpose:** send code to Ollama.
*   **Input:** `{ "sourceCode": "..." }`
*   **Output:** `{ "convertedCode": "..." }`
*   **Logic:**
    1.  Validate input.
    2.  Construct Prompt (from `prompt_engineering.md`).
    3.  `axios.post('localhost:11434/api/generate')`.
    4.  Return `response`.

### 2. `POST /save`
**Purpose:** Write the result to the user's disk.
*   **Input:** 
    ```json
    {
      "content": "import ...",
      "directory": "C:/Users/... (optional)",
      "filename": "mytest.spec.ts"
    }
    ```
*   **Output:** `{ "success": true, "path": "..." }`
*   **Logic:**
    1.  Check if directory exists (create if not).
    2.  `fs.writeFileSync`.

### 3. `GET /health` (Optional)
**Purpose:** Verify server is up.
*   **Response:** `OK`
