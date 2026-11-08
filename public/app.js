const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const sendButton = document.querySelector("#send");
const messagesEl = document.querySelector("#messages");
const welcomeEl = document.querySelector("#welcome");
const history = [];

function addMessage(role, content, extraClass = "") {
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`;
  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "N";
    row.appendChild(avatar);
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  messagesEl.scrollIntoView({ behavior: "smooth", block: "end" });
  return row;
}

async function submitQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed || sendButton.disabled) return;
  welcomeEl.hidden = true;
  addMessage("user", trimmed);
  history.push({ role: "user", content: trimmed });
  input.value = "";
  input.style.height = "auto";
  sendButton.disabled = true;
  const typing = addMessage("assistant", "Nevin is thinking through the Chemistry…", "typing");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-20) })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    typing.remove();
    addMessage("assistant", data.reply);
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    typing.remove();
    addMessage("assistant", `I couldn't connect just now. ${error.message}`);
    history.pop();
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(input.value);
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
});
document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => submitQuestion(button.dataset.prompt));
});
