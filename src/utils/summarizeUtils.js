// In production, keep keys in .env (never expose in frontend!)
const GOOGLE_API_KEY = "AIzaSyB9vkuxJd2cGnfuxiUITaqSEZzYpLaJoQM";
const OPENROUTER_API_KEY =
  "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";

// ---------------- Utility: Clean & Format Bullet Points ----------------
const formatSummary = (text) => {
  if (!text) return null;

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Remove markdown * and ** completely
      let cleaned = line.replace(/^\*+\s*/g, "").replace(/\*+/g, "");

      // Ensure each line starts with •
      if (!cleaned.startsWith("•")) {
        cleaned = `• ${cleaned}`;
      }

      // Bold the first phrase before colon/dash, but without markdown
      const parts = cleaned.slice(2).split(/[:\-–]/); // slice(2) to remove bullet
      if (parts.length > 1) {
        const bolded = `<b>${parts[0].trim()}</b>: ${parts.slice(1).join(":").trim()}`;
        return `• ${bolded}`;
      }

      return cleaned;
    })
    .join("\n");
};

// ---------------- Google Gemini Summarizer ----------------
export const summarizeWithGoogle = async (text, language) => {
  const prompt = `Summarize the following feedback into 5 key points in ${language}. Only use ${language}, no English. , including headings and descriptions:\n\n${text}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
        }),
      }
    );

    const result = await response.json();
    console.log("Gemini raw response:", result);

    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    return formatSummary(output);
  } catch (error) {
    console.error("Google Gemini failed:", error);
    return null;
  }
};

// ---------------- OpenRouter (Claude-3-Haiku) Summarizer ----------------
export const summarizeWithOpenRouter = async (text, language) => {
  const prompt = `Summarize the following feedback into 5 key points in ${language}. Only use ${language}, no English. , including headings and descriptions:\n\n${text}`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      }
    );

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);

    const result = await response.json();
    console.log("OpenRouter raw response:", result);

    const output = result?.choices?.[0]?.message?.content;
    return formatSummary(output);
  } catch (error) {
    console.error("OpenRouter failed:", error);
    return null;
  }
};

// ---------------- Unified Summarizer (tries Google → OpenRouter) ----------------
export const summarize = async (text, language = "English") => {
  let summary = await summarizeWithGoogle(text, language);
  if (summary) {
    console.log("Summarized with Google Gemini");
    return summary;
  }

  summary = await summarizeWithOpenRouter(text, language);
  if (summary) {
    console.log("Summarized with OpenRouter Claude-3-Haiku");
    return summary;
  }

  throw new Error(
    " Summarization failed: Both Gemini and Claude-3-Haiku returned null. Please check API keys, rate limits, or input formatting."
  );
};
