# Nevin Chemistry Chatbot — Day 2 Progress Report

**Challenge:** Decoding Data Science — Building Agentic AI Application Challenge  
**Project:** Nevin Chemistry Chatbot  
**Day:** 2  
**Project stage:** Initial prototype and environment scaffold

## 1. Project objective

Develop an AI-powered Chemistry learning assistant that helps students understand concepts and solve Chemistry questions through structured explanations instead of only returning final answers.

## 2. Environment setup

The project workspace has been organised around a Node.js and Express application. A Windows `START-NEVIN.bat` helper is included to reduce manual terminal work: it checks for Node.js, creates the local environment file from the example, installs dependencies, and starts the server.

| Component | Day 2 setup |
|---|---|
| Runtime | Node.js 20+ |
| Server | Express |
| AI SDK | OpenAI JavaScript SDK |
| Model API | OpenAI Responses API |
| Front end | HTML, CSS, vanilla JavaScript |
| Configuration | `.env` and `.env.example` |
| Version control | GitHub-ready repository structure |

The API key is designed to be stored as a server-side environment variable. It is not included in front-end code or committed configuration.

## 3. Initial development completed in the prototype

- Created the initial web chat interface.
- Added Chemistry-focused welcome content and suggested questions.
- Added a chat request endpoint on the server.
- Added a Chemistry tutor instruction set for concept explanations and worked calculations.
- Added basic input validation and user-facing error handling.
- Added a health-check endpoint.
- Added project setup and security documentation.

## 4. Planned validation

The following checks must be run in the local environment after adding a valid API key:

1. Install dependencies with `npm install`.
2. Start the application with `npm start`.
3. Confirm `GET /api/health` returns a healthy status.
4. Ask a mole-conversion question and check that units are shown.
5. Ask the assistant to balance a chemical equation and verify atom counts.
6. Ask a conceptual question about ionic and covalent bonding.
7. Test an empty or invalid request.
8. Confirm that the API key is not visible in browser developer tools or repository files.

**Important:** These are validation steps, not claims that live API tests have already passed. They must be completed on the developer's machine with a valid API key.

## 5. Current limitations

- The live API call depends on the developer adding a valid OpenAI API key.
- Model availability and billing depend on the API account.
- The prototype does not yet include authentication, database-backed history, image uploads, or automated Chemistry verification.
- Responses require review because generative AI can make mistakes.

## 6. Next development steps

- Run and test the prototype locally.
- Improve answer formatting for equations, symbols, and calculations.
- Add a verified Chemistry reference layer or curated learning resources.
- Add image-based question input if needed.
- Add rate limiting and authentication before public deployment.
- Deploy the application and capture genuine screenshots for the challenge workbook.

## 7. Evidence to attach to the challenge workbook

Add screenshots after performing the corresponding actions:

- Project folder and installed dependencies.
- Terminal showing the server started successfully.
- Browser showing the Nevin welcome screen.
- A successful Chemistry response.
- GitHub repository showing the committed files.

Do not label a planned test as completed. Add the actual date, screenshots, and commit link after carrying out each step.
