import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.GROQ_MODEL || process.env.OPENAI_MODEL || "openai/gpt-oss-20b";
const defaultBaseURL = process.env.GROQ_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.groq.com/openai/v1";

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

Safety and accuracy:
- Do not give instructions for making explosives, poisons, illicit drugs, or other harmful substances.
- Do not present hazardous laboratory procedures as safe home experiments.
- If uncertain, say what needs verification rather than fabricating an answer.
- Use plain language while keeping Chemistry terminology accurate.
- End with one short check-your-understanding question when it naturally helps learning.
`;

let client;

function getClient() {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error("The server administrator has not configured a valid API key for the chat provider.");
    error.status = 503;
    throw error;
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: defaultBaseURL
    });
  }

  return client;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Nevin Chemistry Chatbot", modelConfigured: Boolean(model) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return res.status(400).json({ error: "Send between 1 and 20 conversation messages." });
    }

    const cleanMessages = messages.map((message) => {
      if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string") {
        throw new Error("Each message must have a valid role and text content.");
      }
      return { role: message.role, content: message.content.slice(0, 5000) };
    });

    const response = await getClient().responses.create({
      model,
      instructions: chemistryInstructions,
      input: cleanMessages
    });

    res.json({ reply: response.output_text || "I couldn't produce a response. Please try rephrasing your question." });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    const status = error.status && Number.isInteger(error.status) ? error.status : 500;
    res.status(status).json({
      error: status === 503
        ? "The chat provider API key has not been configured on the server yet."
        : "Nevin couldn't process that request. Check the server configuration and try again."
    });
  }
});

app.listen(port, () => {
  console.log(`Nevin Chemistry Chatbot is running at http://localhost:${port}`);
});
