# 🎭 Selenium Java to Playwright TypeScript Converter

A local web application that converts **Selenium Java (TestNG)** test code into **Playwright TypeScript** using AI (Ollama with CodeLlama).

![Converter Demo](docs/demo.png)

## ✨ Features

- 🔄 **AI-Powered Conversion** - Uses local Ollama (CodeLlama) for intelligent code translation
- 🎨 **Modern UI** - Beautiful glassmorphism design with React + Tailwind CSS
- 💾 **Save to Disk** - Export converted code directly to your file system
- 📋 **Copy to Clipboard** - Quick copy functionality
- 🚀 **Local & Private** - Everything runs on your machine, no data sent to cloud

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Express.js |
| AI Engine | Ollama (CodeLlama) |

## 📋 Prerequisites

- **Node.js** v20.19+ or v22.12+
- **Ollama** installed and running locally
- **CodeLlama** model pulled in Ollama

## 🚀 Quick Start

### 1. Install Ollama & Pull CodeLlama
```bash
# Install Ollama from https://ollama.ai
ollama pull codellama
```

### 2. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Start the Application
```bash
# Terminal 1: Start Backend (Port 3001)
cd server
node index.js

# Terminal 2: Start Frontend (Port 5173)
cd client
npm run dev
```

### 4. Open in Browser
Navigate to: **http://localhost:5173**

## 📂 Project Structure

```
├── server/                 # Express Backend
│   └── index.js           # API endpoints (/convert, /save)
├── client/                # React Frontend
│   └── src/
│       ├── App.jsx        # Main Converter Component
│       └── index.css      # Styling
├── architecture/          # Technical SOPs
│   ├── prompt_engineering.md
│   └── server_api.md
├── gemini.md              # Project Constitution
├── task_plan.md           # Development Checklist
├── progress.md            # Progress Log
└── findings.md            # Research & Discoveries
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/convert` | POST | Send Java code, receive TypeScript |
| `/save` | POST | Save converted code to disk |

## 📜 Conversion Mapping

| Selenium Java | Playwright TypeScript |
|---------------|----------------------|
| `@Test` | `test('name', async ({page}) => {})` |
| `@BeforeClass` | `test.beforeAll()` |
| `@BeforeMethod` | `test.beforeEach()` |
| `driver.get(url)` | `await page.goto(url)` |
| `driver.findElement(By.id("x"))` | `page.locator("#x")` |
| `element.click()` | `await locator.click()` |
| `element.sendKeys("text")` | `await locator.fill("text")` |
| `Assert.assertEquals(a, b)` | `expect(a).toBe(b)` |

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
