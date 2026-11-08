# Chemistry Chatbot Test Checklist

**Project:** Nevin Chemistry Chatbot  
**Provider:** Groq API
## Chemistry response tests

| ID | Test prompt / task | Expected result / what to check | Status | Notes |

| T01 | What is the difference between an atom and a molecule? Explain with simple examples. | Correct distinction, simple examples and understandable explanation. | **PASS — minor UI issue** | The explanation was appropriate. Raw Markdown markers (such as `**`, headings and table separators) appeared as plain text in the chat interface. Improve Markdown rendering in the frontend. |
| T02 | Balance: H2 + O2 -> H2O | Correct balanced equation: 2H2 + O2 -> 2H2O; atom counts equal on both sides. | **PASS** | Correct coefficients and atom counts were provided. The chatbot's “start with the hardest element” advice should be treated as a heuristic, not a universal rule. |
| T03 | Calculate the molar mass of H2SO4. | Correct atomic-mass contributions, arithmetic and g/mol units. | **PASS** | The chatbot calculated approximately 98.08 g/mol. The follow-up calculation for 0.25 mol H2SO4 producing 1.00 mol of O atoms was also correct. |
| T04 | Explain acids and bases; calculate pH for [H+] = 0.001 mol/L and answer follow-up pH questions. | Correct acid/base definitions and pH calculations. At [H+] = 1.0 x 10^-3 mol/L, pH = 3. | **PASS — one inconsistency found and corrected in follow-up** | The pH 3 explanation and pH 5 follow-up were correct. In one pH 9 explanation, the chatbot calculated the OH-/H+ ratio as 10,000 but later stated 100. The correct ratio is 10,000. Retest this case after any prompt/model changes. |
| T05 | Stoichiometry: 2Al + 6HCl -> 2AlCl3 + 3H2; calculate H2 from 4 mol Al, then from 5 mol Al. | Correct 3:2 mole ratio and unit-aware calculations. Expected results: 6 mol H2 and 7.5 mol H2, respectively. | **PASS** | Both calculations were correct. The follow-up question using 5 mol Al was also answered correctly. Showing unit cancellation explicitly would improve the explanation. |

## Additional observations

- A response being generated is not proof that its Chemistry is correct; continue checking equations, arithmetic, units, significant figures and assumptions.
- The chatbot's content was correct in the tested balancing, molar-mass and stoichiometry examples.
- A pH 9 response contained an internal numerical contradiction. The correct OH- to H+ concentration ratio at pH 9 (at 25 °C) is 10^4, or 10,000:1.
- The frontend displayed raw Markdown syntax in at least one answer. This is a presentation issue rather than a Chemistry calculation error.
- These five topic checks do not establish broad reliability. Additional tests are still required, especially ambiguity handling, empty input, long input, API failure handling and safety/security behaviour.

## Tests still pending

| ID | Test prompt / task | What to check | Status |

| T06 | Explain ionic vs covalent bonding using examples. | Correct distinction, examples and comparison. | NOT SCORED — observed in screenshots, but no separate formal result recorded |
| T07 | Ask an ambiguous question with missing values. | Assistant asks a focused clarification instead of inventing values. | NOT RUN |
| T08 | Submit an empty message. | UI/backend validation handles it safely. | NOT RUN |
| T09 | Submit a very long message. | Input limit and error handling work safely. | NOT RUN |
| T10 | Temporarily use an invalid/revoked key in a local test copy. | Safe error shown; no secret exposed in browser or logs. | NOT RUN |

## Evidence capture

Save genuine screenshots in `docs/screenshots/`. Suggested filenames:

- `01-chatbot-home.png`
- `02-atom-vs-molecule.png`
- `03-balanced-equation.png`
- `04-molar-mass-h2so4.png`
- `05-acids-bases-ph.png`
- `06-stoichiometry-4mol-al.png`
- `07-stoichiometry-5mol-al.png`

Before committing screenshots, check that they do not show API keys, passwords, tokens, private account details or other secrets. Never commit `.env`.

## Recording future results

For each new test, record the date/time (GST), exact prompt, actual output, pass/fail and reason, screenshot filename, and any correction required.git add docs/testing-checklist.md