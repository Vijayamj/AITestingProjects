import { useState } from 'react'
import './App.css'

function App() {
  const [javaCode, setJavaCode] = useState('')
  const [convertedCode, setConvertedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveDir, setSaveDir] = useState('')
  const [fileName, setFileName] = useState('converted.spec.ts')
  const [saveStatus, setSaveStatus] = useState('')

  const handleConvert = async () => {
    if (!javaCode.trim()) {
      setError('Please enter some Java code to convert.')
      return
    }

    setIsLoading(true)
    setError('')
    setConvertedCode('')

    try {
      const response = await fetch('http://localhost:3001/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceCode: javaCode })
      })

      const data = await response.json()

      if (response.ok) {
        setConvertedCode(data.convertedCode)
      } else {
        setError(data.error || 'Conversion failed.')
      }
    } catch (err) {
      setError('Could not connect to the server. Is it running on port 3001?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!convertedCode.trim()) {
      setSaveStatus('No code to save!')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: convertedCode,
          directory: saveDir || undefined,
          filename: fileName
        })
      })

      const data = await response.json()
      if (response.ok) {
        setSaveStatus(`✅ Saved to: ${data.path}`)
      } else {
        setSaveStatus(`❌ ${data.error}`)
      }
    } catch (err) {
      setSaveStatus('❌ Failed to save file.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode)
    setSaveStatus('📋 Copied to clipboard!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          Selenium → Playwright Converter
        </h1>
        <p className="text-slate-400 text-lg">
          Transform your Java TestNG tests into TypeScript Playwright tests using AI
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Powered by Ollama (codellama)
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Panel */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                <span className="text-2xl">☕</span> Selenium Java (Input)
              </h2>
              <span className="text-xs text-slate-500 px-3 py-1 bg-slate-800/50 rounded-full">
                TestNG
              </span>
            </div>
            <textarea
              className="code-editor w-full h-96"
              placeholder={`// Paste your Selenium Java code here...\n\n@Test\npublic void testLogin() {\n    driver.get("https://example.com");\n    driver.findElement(By.id("username")).sendKeys("user");\n    driver.findElement(By.id("password")).sendKeys("pass");\n    driver.findElement(By.id("submit")).click();\n}`}
              value={javaCode}
              onChange={(e) => setJavaCode(e.target.value)}
            />
          </div>

          {/* Output Panel */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                <span className="text-2xl">🎭</span> Playwright TypeScript (Output)
              </h2>
              {convertedCode && (
                <button onClick={handleCopy} className="btn-secondary text-sm py-1 px-3">
                  📋 Copy
                </button>
              )}
            </div>
            <textarea
              className="code-editor w-full h-96"
              placeholder="// Converted TypeScript code will appear here..."
              value={convertedCode}
              readOnly
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="btn-primary flex items-center gap-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Converting with AI...
              </>
            ) : (
              <>
                <span className="text-xl">⚡</span>
                Convert to Playwright
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Save Section */}
        {convertedCode && (
          <div className="glass max-w-3xl mx-auto p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <span>💾</span> Save to Disk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">Directory (optional)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="D:\output or leave empty for default"
                  value={saveDir}
                  onChange={(e) => setSaveDir(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Filename</label>
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="test.spec.ts"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleSave} className="btn-secondary">
                💾 Save File
              </button>
              {saveStatus && (
                <span className={`text-sm ${saveStatus.includes('✅') ? 'text-green-400' : saveStatus.includes('❌') ? 'text-red-400' : 'text-cyan-400'}`}>
                  {saveStatus}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-slate-500 text-sm">
        Built with ❤️ using React + Vite + Ollama
      </footer>
    </div>
  )
}

export default App
