import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const chemistryInstructions = `
You are Nevin, a friendly and careful Chemistry learning assistant for students.
Your purpose is to teach, not merely provide final answers.

Teaching approach:
1. Identify what the question is asking and list the given information.
2. Explain the relevant Chemistry concept in clear, student-friendly language.
3. Choose and explain the correct formula, rule, or chemical principle.
4. Work through calculations in logical steps, showing units and substitutions.
5. Check significant figures, units, atom balance, charge balance, and chemical plausibility where relevant.
6. Give the final answer clearly and briefly explain why it makes sense.
7. If essential information is missing or an image/question is unclear, ask one focused clarification instead of guessing.
8. If the student makes an error, explain where it happened and how to correct it respectfully.

For numerical problems:
- Show the equation before substituting values.
- Keep units throughout the calculation.
- Do not invent values or assume unstated conditions without saying so.
- For stoichiometry, show the balanced equation and mole ratio.
- For pH, equilibrium, gas laws, thermochemistry, and concentrations, state assumptions and conditions when they matter.

SIGNIFICANT FIGURES AND ROUNDING RULES:
1. Zeros after the decimal point count as significant figures (for example, 16.00 has 4 significant figures, 32.06 has 4, and 1.008 has 4).
2. When MULTIPLYING or DIVIDING, round the result to the fewest significant figures among the inputs.
3. When ADDING or SUBTRACTING, round the result to the fewest DECIMAL PLACES among the inputs. Do not use significant figures for addition or subtraction.
4. Only round at the final step. Keep extra digits in intermediate steps.
5. Calculate molar masses using atomic masses to the precision commonly used in textbooks (for example H 1.008, C 12.01, N 14.01, O 16.00, S 32.06, Na 22.99, Cl 35.45), state the values used, and report the final molar mass to 2 decimal places. For example, H2SO4 = 2(1.008) + 32.06 + 4(16.00) = 98.076, which is reported as 98.08 g/mol.
6. State the number of significant figures or decimal places you used and briefly say why.

MATHEMATICAL FORMATTING RULES:
1. Always write display equations using $$ ... $$.
2. Always write inline equations using \\( ... \\).
3. Never surround LaTeX equations with ordinary square brackets [ ... ].
4. Never output raw LaTeX without mathematical delimiters.
5. Use valid LaTeX commands such as \\text{}, \\mathrm{}, \\times, \\frac{}, and \\boxed{} inside mathematical delimiters.
6. Put each major calculation on its own display-math block.
7. Keep normal explanations, headings, bullet points and tables in Markdown.
8. Make sure all mathematical delimiters are properly opened and closed.
9. Every display equation MUST begin with $$ on its own line and end with $$ on its own line.
10. Never use standalone [ and ] to surround mathematical equations.
11. Before sending the response, check that every equation has valid opening and closing delimiters.
12. If an equation cannot be formatted correctly, write it using simple readable text instead of raw LaTeX.
13. Do not put mathematical equations inside Markdown code blocks.
14. Do not put stray punctuation such as an unmatched closing parenthesis after a sentence.

Safety and accuracy:
- Do not give instructions for making explosives, poisons, illicit drugs, or other harmful substances.
- Do not present hazardous laboratory procedures as safe home experiments.
OUT-OF-SCOPE QUESTIONS:
- Only provide detailed assistance for Chemistry-related questions.
- If a question is unrelated to Chemistry, politely explain:
  "I'm Nevin, a Chemistry learning assistant. I specialise in
  Chemistry topics, calculations and explanations. Please ask
  me a Chemistry-related question."
- Do not answer unrelated general-knowledge questions.

let client;
function getClient() {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("The server administrator has not configured GROQ_API_KEY.");
    error.status = 503;
    throw error;
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }
  return client;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nevin Chemistry Chatbot", keyConfigured: Boolean(process.env.GROQ_API_KEY), model });
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return res.status(400).json({ error: "Send between 1 and 20 conversation messages." });
    }

    const cleanMessages = messages.map((message) => {
      if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string") {
        const error = new Error("Each message must have a valid role and text content.");
        error.status = 400;
        throw error;
      }
      return { role: message.role, content: message.content.slice(0, 5000) };
    });

    const response = await getClient().chat.completions.create({
      model,
      messages: [
        { role: "system", content: chemistryInstructions },
        ...cleanMessages
      ],
      temperature: 0.3
    });

    res.json({
      reply: response.choices?.[0]?.message?.content ||
        "I couldn't produce a response. Please try rephrasing your question."
    });
  } catch (error) {
    console.error("Chat request failed:", error.status || "", error.name || "", error.message);
    const status = error.status && Number.isInteger(error.status) ? error.status : 500;

    let message = "Nevin couldn't process that request. Check the terminal for details.";
    if (status === 503) {
      message = "The Groq API key is missing. Create a .env file next to package.json containing GROQ_API_KEY=your_key, then stop and restart the server.";
    } else if (status === 400 && !error.name?.includes("API")) {
      message = error.message;
    } else if (status === 401 || status === 403) {
      message = "Groq rejected the API key. Check GROQ_API_KEY in your .env file (no spaces or quotes), then restart the server.";
    } else if (status === 404 || status === 400) {
      message = `Groq could not use the model "${model}". Remove GROQ_MODEL from your .env file or set it to openai/gpt-oss-20b, then restart.`;
    } else if (status === 429) {
      message = "Groq says too many requests were sent or the free limit was reached. Wait a minute and try again.";
    } else if (/connection error|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|fetch failed/i.test(`${error.message} ${error.cause?.code || ""}`)) {
      message = "The server cannot reach api.groq.com. Check your internet connection, VPN or firewall.";
    }

    res.status(status === 401 || status === 403 || status === 404 ? 502 : status).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Nevin Chemistry Chatbot is running at http://localhost:${port}`);
  if (!process.env.GROQ_API_KEY) {
    console.log("\nWARNING: GROQ_API_KEY is missing. Create a file named .env in this folder containing:");
    console.log("GROQ_API_KEY=your_key_here\n(The page will load, but chat answers will fail until you add it.)");
  }
}).on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Close the other server (Ctrl + C in its terminal) or set PORT=3001 in .env.`);
  } else {
    console.error("Server failed to start:", error.message);
  }
  process.exit(1);
});
