
const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const sendButton = document.querySelector("#send");
const messagesEl = document.querySelector("#messages");
const welcomeEl = document.querySelector("#welcome");

const history = [];
const MAX_HISTORY = 12;
const MAX_LENGTH = 2000;

function addMessage(role, content, extraClass = "") {
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "N";
    avatar.setAttribute("aria-hidden", "true");
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (
    role === "assistant" &&
    window.marked &&
    window.DOMPurify
  ) {
    const html = window.marked.parse(content, {
      breaks: true,
      gfm: true
    });

    bubble.innerHTML = window.DOMPurify.sanitize(html);

    if (window.renderMathInElement) {
      window.renderMathInElement(bubble, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    }
  } else {
    bubble.textContent = content;
  }

  row.appendChild(bubble);
  messagesEl.appendChild(row);

  row.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

  return row;
}

function setLoading(loading) {
  sendButton.disabled = loading;
  input.disabled = loading;
  sendButton.textContent = loading ? "…" : "↑";
}

async function submitQuestion(question) {
  const trimmed = question.trim();

  if (!trimmed || sendButton.disabled) return;

  if (trimmed.length > MAX_LENGTH) {
    addMessage(
      "assistant",
      "Your question is too long. Please keep it under 2,000 characters."
    );
    return;
  }

  welcomeEl.hidden = true;

  addMessage("user", trimmed);

  history.push({
    role: "user",
    content: trimmed
  });

  input.value = "";
  input.style.height = "auto";

  setLoading(true);

  const typing = addMessage(
    "assistant",
    "Nevin is working through your Chemistry question…",
    "typing"
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: history.slice(-MAX_HISTORY)
      }),
      signal: AbortSignal.timeout(45000)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error || "The request could not be completed."
      );
    }

    typing.remove();

    addMessage(
      "assistant",
      data.reply || "Please rephrase your Chemistry question."
    );

    history.push({
      role: "assistant",
      content: data.reply || ""
    });

    if (data.durationMs) {
      console.info(
        `Chemistry API response time: ${data.durationMs} ms`
      );
    }

  } catch (error) {
    typing.remove();

    const message =
      error.name === "TimeoutError"
        ? "The request timed out. Please try again with a shorter question."
        : error.message || "Please check your connection and try again.";

    addMessage(
      "assistant",
      `**I couldn't complete that request.** ${message}`
    );

    history.pop();

    console.error("Chat request error:", error);

  } finally {
    setLoading(false);
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height =
    `${Math.min(input.scrollHeight, 120)}px`;
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    submitQuestion(button.dataset.prompt);
  });
});
