# Easiest setup on Windows (recommended)

You do **not** need to type commands manually.

1. Install **Visual Studio Code** if it is not already installed: https://code.visualstudio.com/
2. Install **Node.js LTS** from https://nodejs.org/en/download
   - Choose the LTS download.
   - Keep the default installation options.
   - Restart your computer after installation if Windows asks.
3. Extract this ZIP folder.
4. Open the extracted `nevin-chemistry-chatbot-day2` folder in VS Code:
   - In VS Code, choose **File → Open Folder**.
5. In the folder, double-click `START-NEVIN.bat` in File Explorer.
6. The first time, Notepad opens `.env`. Paste your own API key after `OPENAI_API_KEY=`. Save and close Notepad.
7. Wait for the black window to say the server is running. Your browser should open at `http://localhost:3000`.

**Important:** Keep the black command window open while using Nevin. To stop the app, click that window and press `Ctrl + C`.

If Windows blocks the `.bat` file, right-click it and choose **Run as administrator** only if you trust the downloaded project files; otherwise start it from VS Code's terminal with `npm start`.

## If you prefer the VS Code terminal

Open **Terminal → New Terminal**, then run:

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

---

# Nevin Chemistry Chatbot

**Nevin** is an AI-powered Chemistry learning assistant designed to help students understand Chemistry concepts and solve problems through guided, step-by-step explanations.

This repository contains the Day 2 prototype: a lightweight web application with a browser-based chat interface and a server-side OpenAI API integration.

## Day 2 scope

- Chemistry-focused tutoring instructions.
- Conversational question and answer flow.
- Step-by-step calculation guidance.
- Starter prompts for mole calculations, balancing equations, bonding, stoichiometry, and acids/bases.
- Server-side API key handling.
- Basic request validation and health endpoint.

## Technology

- Node.js 20+
- Express
- OpenAI JavaScript SDK
- OpenAI Responses API
- HTML, CSS, and vanilla JavaScript

## Run locally

1. Install Node.js 20 or newer.
2. Download or clone this repository.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env`.
5. Add your own OpenAI API key to `.env`:

   ```env
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-5.5
   PORT=3000
   ```

6. Start the server:

   ```bash
   npm start
   ```

7. Open `http://localhost:3000`.

## API endpoints

- `GET /api/health` — checks that the server is running.
- `POST /api/chat` — accepts a `messages` array containing user/assistant text messages and returns `{ "reply": "..." }`.

## Security notes

- The API key must remain on the server in `.env` or a deployment secret manager.
- Never put the API key in browser JavaScript, HTML, screenshots, GitHub commits, or public documentation.
- `.env` is excluded by `.gitignore`.
- Do not share API keys in chat or upload them to the repository.
- Add authentication, rate limiting, logging controls, and stronger abuse protection before public deployment.

## Current limitations

- This is an early prototype, not a finished production learning platform.
- No user accounts, persistent chat history, file/image upload, database, or formal Chemistry answer-verification engine is included yet.
- AI-generated explanations can contain errors. Students should verify important work against class notes, textbooks, and instructor guidance.
- The model name can be changed through `OPENAI_MODEL` if the selected model is unavailable to the API account.

## Project structure

```text
nevin-chemistry-chatbot/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── docs/
│   ├── day-2-progress.md
│   ├── prompt-design.md
│   └── testing-checklist.md
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Challenge progress

See [`docs/day-2-progress.md`](docs/day-2-progress.md) for the Day 2 environment setup and development record.
