
import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const model =
  process.env.GROQ_MODEL ||
  process.env.OPENAI_MODEL ||
  "openai/gpt-oss-20b";

const baseURL =
  process.env.GROQ_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  "https://api.groq.com/openai/v1";

const API_TIMEOUT = 40000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const chemistryInstructions = `
You are Nevin, a friendly and accurate Chemistry learning assistant.

Your goal is to help students understand Chemistry through clear,
step-by-step explanations.

TEACHING METHOD:
1. Identify the question and list the given information.
2. Explain the relevant Chemistry concept.
3. Select the correct formula or chemical principle.
4. Substitute the values and show each calculation step.
5. Include correct units and significant figures.
6. Check arithmetic, chemical formulas, atom balance and charges.
7. Clearly state the final answer.
8. Explain the result briefly.

ACCURACY RULES:
- Never invent missing values.
- Ask one focused question if essential information is missing.
- Keep unrounded values during intermediate calculations.
- Round only the final answer appropriately.
- For stoichiometry, balance the equation first.
- For pH and pOH, state the temperature assumption when relevant.
- For percentage composition, use the unrounded molar mass.
- For empirical formulas, show the mole ratios.
- For molecular formulas, calculate the multiplier explicitly.
- Recheck calculations if the student challenges an answer.

FORMATTING:
- Use clear Markdown headings and numbered steps.
- Display equations using LaTeX.
- Keep explanations easy for students to follow.
- Avoid unnecessary long explanations.

EDGE CASES:
- Ask for clarification when a question is ambiguous.
- Explain politely when a question is incomplete.
- If a request is outside Chemistry, explain that you specialize in Chemistry.
- Never fabricate a calculation or claim that an answer was verified when it was not.

SAFETY:
- Do not provide instructions for making explosives, poisons,
  illicit drugs or other harmful substances.
- Do not describe dangerous experiments as safe home activities.

End with a short learning question when appropriate.
`;

let client;

function getClient() {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error("API key is not configured.");
    error.status = 503;
    throw error;
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL,
      timeout: API_TIMEOUT,
      maxRetries: 1
    });
  }

  return client;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Nevin Chemistry Chatbot",
    provider: "Groq",
    model,
    apiKeyConfigured: Boolean(
      process.env.GROQ_API_KEY ||
      process.env.OPENAI_API_KEY
    )
  });
});

// Chemistry chat endpoint
app.post("/api/chat", async (req, res) => {
  const startedAt = Date.now();

  try {
    const messages = req.body?.messages;

    if (
      !Array.isArray(messages) ||
      messages.length < 1 ||
      messages.length > MAX_MESSAGES
    ) {
      return res.status(400).json({
        error: `Send between 1 and ${MAX_MESSAGES} messages.`
      });
    }

    const cleanMessages = messages.map((message) => {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string"
      ) {
        const error = new Error("Invalid message format.");
        error.status = 400;
        throw error;
      }

      const content = message.content.trim();

      if (!content || content.length > MAX_MESSAGE_LENGTH) {
        const error = new Error(
          `Each message must contain 1 to ${MAX_MESSAGE_LENGTH} characters.`
        );
        error.status = 400;
        throw error;
      }

      return {
        role: message.role,
        content
      };
    });

    const response = await getClient().responses.create({
      model,
      instructions: chemistryInstructions,
      input: cleanMessages,
      max_output_tokens: 1600
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      const error = new Error("The AI provider returned an empty response.");
      error.status = 502;
      throw error;
    }

    const durationMs = Date.now() - startedAt;

    console.info("Chat request completed:", {
      durationMs,
      model
    });

    return res.json({
      reply,
      model,
      durationMs
    });

  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const providerStatus = Number(
      error.status || error.statusCode || 0
    );

    let status = 500;
    let message = "Nevin couldn't complete that request. Please try again.";

    if (providerStatus === 400) {
      status = 400;
      message = error.message;
    } else if (providerStatus === 401 || providerStatus === 403) {
      status = 503;
      message = "The AI provider rejected the server credentials. Please contact the administrator.";
    } else if (providerStatus === 429) {
      status = 429;
      message = "The AI service is busy or its rate limit was reached. Please wait and try again.";
    } else if (providerStatus === 503) {
      status = 503;
      message = "The chat service is not configured. Please contact the administrator.";
    } else if (
      error.name === "APIConnectionTimeoutError" ||
      error.name === "TimeoutError" ||
      /timeout/i.test(error.message || "")
    ) {
      status = 504;
      message = "The request took too long. Please try a shorter question.";
    } else if (providerStatus >= 500) {
      status = 502;
      message = "The AI provider is temporarily unavailable. Please try again shortly.";
    }

    console.error("Chat request failed:", {
      status,
      durationMs,
      errorName: error.name,
      errorMessage: error.message
    });

    if (!res.headersSent) {
      return res.status(status).json({ error: message });
    }
  }
});

// Handle malformed JSON and oversized requests
app.use((error, _req, res, _next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Your request is too large. Please shorten it."
    });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "Invalid JSON request."
    });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    error: "An unexpected server error occurred."
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Nevin Chemistry Chatbot running on port ${port} (model: ${model})`
  );
});
