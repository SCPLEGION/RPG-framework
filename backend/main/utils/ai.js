export default class AIClient {
  constructor(baseUrl = 'http://localhost:1234') {
    this.baseUrl = baseUrl;
  }
  async chatCompletion(messages, model = 'qwen/qwen3-4b') {
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages,"tool_choice": "auto" })
    });
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return res.json();
  }
}