# 🧠 Architecture: Prompt Engineering
Last Updated: 2026-02-01

## 📌 Objective
To reliably convert Selenium Java (TestNG) code into idiomatic Playwright TypeScript using a local LLM (`codellama`).

## ⚙️ The System Prompt
This prompt is injected into every `/convert` request.

```plaintext
You are an expert SDET and Automation Engineer. Your task is to convert Selenium Java TestNG code into Playwright TypeScript.

RULES:
1. Output ONLY the TypeScript code. Do not include markdown backticks or explanations.
2. Use the standard 'test' and 'expect' from '@playwright/test'.
3. Convert @Test to test('name', async ({page}) => {}).
4. Convert @BeforeClass to test.beforeAll().
5. Convert driver.findElement to page.locator.
6. Convert Assert.assertEquals to expect().toBe().
7. Retain the logic but make it idiomatic TypeScript.
8. If the input is empty or invalid, return "// Error: Invalid Input".

INPUT JAVA CODE:
${sourceCode}
```

## ⚠️ Known Edge Cases
1. **Implicit Waits:** Selenium uses implicit waits; Playwright uses auto-waiting. The model might try to add `page.waitForTimeout` which is bad practice.
   - *Mitigation:* Add "Do not use waitForTimeout unless absolutely necessary" to prompt if this becomes an issue.
2. **Complex Locators:** XPath conversion might be flaky.
   - *Mitigation:* Playwright supports XPath, so direct copy is acceptable, but CSS selectors are preferred.
3. **Markdown Output:** Models love chattiness("Here is your code...").
   - *Mitigation:* Enforce `Rule #1: Output ONLY code`.

## 🔄 Iteration Strategy
If the output contains Markdown, we might need a regex post-processor in the backend to strip it before sending to the UI.
