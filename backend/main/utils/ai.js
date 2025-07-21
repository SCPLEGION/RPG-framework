export default class AIClient {
  constructor(baseUrl = 'http://localhost:1234') {
    this.baseUrl = baseUrl;
  }

  async chatCompletion(messages, model = 'qwen/qwen3-4b') {
    const controller = new AbortController();

    try {
      const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, tool_choice: 'auto' }),
        signal: controller.signal,
      });


      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      return await res.json();
    } catch (err) {
      throw new Error(`Request failed: ${err.message}`);
    }
  }
}
