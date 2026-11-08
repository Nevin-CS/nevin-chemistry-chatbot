# Day 2 Testing Checklist

Mark each item only after testing it on the local machine.

- [ ] Node.js 20+ is installed.
- [ ] `npm install` completes successfully.
- [ ] `.env` is created from `.env.example`.
- [ ] A valid API key is stored in `.env` and is not shared.
- [ ] `npm start` starts the server.
- [ ] `http://localhost:3000` displays the Nevin welcome page.
- [ ] `GET /api/health` returns a healthy status.
- [ ] Mole calculation test is successful and shows units.
- [ ] Chemical equation balancing test is successful.
- [ ] Concept explanation test is successful.
- [ ] Invalid request returns a clear error.
- [ ] API key is not exposed in browser code or Git history.
- [ ] Screenshots are captured for the progress workbook.
- [ ] Files are committed to the Chemistry project GitHub repository.
