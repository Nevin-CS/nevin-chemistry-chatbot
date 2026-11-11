# Day 4 – Chemistry Chatbot Testing Evidence

This folder contains the Day 4 progress report and the screenshot evidence archive for the Nevin Chemistry Chatbot.

## Tests documented

1. **Incomplete input handling** – The chatbot asks for the missing chemical compound rather than guessing.
2. **Multi-turn follow-up** – The chatbot uses the earlier H2SO4 question to answer the follow-up about oxygen atoms (0.25 mol H2SO4 corresponds to 1.00 mol of oxygen atoms).
3. **Server-unavailable handling** – With the local server stopped, the frontend displays a connection error (`Failed to fetch`).
4. **Recovery after restart** – After restarting the server and refreshing the app, the chatbot responds successfully to a new chemistry question.
5. **Additional bonding explanation** – Screenshots document an ionic/covalent bonding explanation.

## Evidence files

- `Day4_Progress_Report_Nevin_Pinto.docx` – Combined progress report containing the Day 4 work and test results.
- `Day4_Test_Screenshots.zip` – Archive containing 10 screenshots from the Day 4 tests.

## Testing scope and limitations

These are manual functional checks based on the captured interactions. They do not represent a formal load test, latency benchmark, security audit, or exhaustive test of every possible failure mode.
