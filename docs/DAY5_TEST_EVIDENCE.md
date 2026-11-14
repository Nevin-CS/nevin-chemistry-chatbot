# Day 5 – Testing Evidence
**Project:** Nevin Chemistry Chatbot  
**Participant:** Nevin Pinto  
**Challenge:** DDS Agentic AI Application Challenge  
**Date:** 14 November 2026

## Day 5 functional checks reviewed

The following chatbot responses were provided in the conversation and checked for chemistry accuracy and calculation steps.

| Test | Prompt / task | Expected result | Review |
|---|---|---|---|
| 1 – Balancing equations | Balance H2 + O2 -> H2O and show the steps. | 2H2 + O2 -> 2H2O; H and O counts match on both sides. | PASS – correct balanced equation and atom counts. |
| 2 – Stoichiometry | Find moles of water from 2 mol H2 with excess O2. | 2 mol H2O using the 1:1 H2:H2O mole ratio. | PASS – correct ratio, substitution and result. |
| 3 – Acids and bases | Find pH when [H+] = 0.001 M. | pH = -log10(0.001) = 3. | PASS – correct formula and result. |

## Additional project/interface evidence

The `day5-evidence` folder contains actual screenshots supplied during this conversation:
1. Initial Day 5 interface.
2. Project file structure.
3. HTML dependency/script references.
4. CSS styling.
5. Final interface displaying a worked sulfuric-acid molar-mass response.

## Evidence limitation

The three test answers above were pasted as chatbot response text in the conversation and reviewed. Separate screenshot files showing the full Test 1, Test 2 and Test 3 response screens were not supplied as image attachments in this turn. Therefore, this document records the reviewed test outcomes without representing them as separately captured screenshots.

## Scope of testing

These are manual functional checks of selected chemistry tasks. They do not constitute exhaustive chemistry validation, automated regression testing, load testing, a security audit, or performance benchmarking.

## Day 5 completion items
- Include this report and evidence in the project `docs/` folder.
- Push the files to the GitHub repository.
- Verify the uploaded files and latest commit on GitHub.
