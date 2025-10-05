import { getDocument } from "pdfjs-dist";

const GOOGLE_API_KEY = "AIzaSyB9vkuxJd2cGnfuxiUITaqSEZzYpLaJoQM";
const OPENROUTER_API_KEY =
  "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";

// Extracts raw text from the first page of a PDF
export const extractTextFromPDF = async (url) => {
  try {
    const pdf = await getDocument(url).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const rawText = textContent.items.map((item) => item.str).join(" ");
    const cleanText = rawText
      .replace(/\s{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    console.log(" Raw PDF Text Extracted:");
    console.log(cleanText);

    return cleanText;
  } catch (err) {
    console.error(" PDF extraction failed:", err);
    return "";
  }
};

//  Summarizes complaint points using Google Gemini
const summarize = async (text, language = "English") => {
  const prompt = `Summarize the following complaint letter into exactly 5 key points in ${language}. Use bullet points and include headings and descriptions:\n\n${text}`;

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
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log(" Gemini raw response:", output);
    return output || null;
  } catch (error) {
    console.error(" Google Gemini failed:", error);
    return null;
  }
};

// Extracts address and contact using Claude via OpenRouter
const extractMetadata = async (text) => {
  const prompt = `Extract the sender's address and contact number from the following complaint letter.

Focus only on the "From" section of the letter—this is the complainant's address and contact. Ignore any "To" section or recipient details.

Return the result strictly in JSON format like:
{
  "address": "sender's full address",
  "contact": "sender's contact number"
}

If no contact number is found, return "Contact not found". If no address is found, return "Address not found".

Text:
${text}`;

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
          temperature: 0.3,
        }),
      }
    );

    const result = await response.json();
    const output = result?.choices?.[0]?.message?.content?.trim();

    console.log(" Raw Metadata Response:");
    console.log(output);

    if (!output || !output.startsWith("{") || !output.endsWith("}")) {
      throw new Error("Invalid JSON format from AI");
    }

    return JSON.parse(output);
  } catch (error) {
    console.error("Metadata extraction failed:", error);
    return {
      address: "Address not found",
      contact: "Contact not found",
    };
  }
};

//  Removes Gemini's heading line
const removeHeading = (text) => {
  const lines = text.split("\n");
  return lines.filter((line) => !line.startsWith("**")).join("\n");
};

//  Enforces exactly 5 bullet points (accepts *, •, -)
const enforceFivePoints = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && /^[•\-\*]/.test(line));
  return lines.slice(0, 5).join("\n");
};

//  Bolds the heading or key phrase in each bullet
const boldImportantWords = (text) => {
  return text
    .split("\n")
    .map((line) => {
      const match = line.match(/^(?:•|\*|\-|\d+\.)?\s*(.*?)([:\-–])/);
      if (match) {
        const important = match[1].trim();
        const rest = line.replace(important, `**${important}**`);
        return rest;
      }
      return line;
    })
    .join("\n");
};

//  Formats the final complaint narrative
const formatComplaintNarrative = ({ summaryPoints, address, contact }) => {
  if (
    !summaryPoints ||
    typeof summaryPoints !== "string" ||
    summaryPoints.trim().length === 0
  ) {
    console.warn(" Invalid summaryPoints input:", summaryPoints);
    return "• Summary unavailable due to extraction error.";
  }

  const preserveBold = (text) => text.replace(/["“”]/g, '"').trim();

  const numberedPoints = summaryPoints
    .split("\n")
    .map((line) => preserveBold(line))
    .filter((line) => line.length > 0)
    .map(
      (line, idx) =>
        `${idx + 1}. ${line.replace(/^•\s*/, "").replace(/^\*\s*/, "")}`
    )
    .join("\n");

  return `
The resident, Mr. Karthick Ramalagar, on behalf of the residents of ${address}, requests the Greater Chennai Corporation to address the sanitary issues in their locality.

**Address:** ${address}  
**Contact:** ${contact}

**Key Complaint Points:**  
${numberedPoints}
  `.trim();
};

// Full summarization flow: extract → summarize → metadata → format
export const generateComplaintSummary = async (pdfUrl, language) => {
  try {
    const rawText = await extractTextFromPDF(pdfUrl);
    if (!rawText || rawText.length < 50) {
      throw new Error("PDF text extraction returned insufficient content");
    }

    console.log("Starting AI summarization and metadata extraction...");

    const [summaryRaw, metadata] = await Promise.all([
      summarize(rawText, language),
      extractMetadata(rawText),
    ]);

    if (
      !summaryRaw ||
      typeof summaryRaw !== "string" ||
      summaryRaw.trim().length === 0
    ) {
      console.warn(" Gemini returned empty summary");
      return formatComplaintNarrative({
        summaryPoints: "• Summary unavailable due to extraction error.",
        address: metadata?.address || "Address not found",
        contact: metadata?.contact || "Contact not found",
      });
    }

    const cleanedSummary = removeHeading(summaryRaw);
    const summaryLimited = enforceFivePoints(cleanedSummary);
    const summaryEnhanced = boldImportantWords(summaryLimited);

    console.log(" Final Summary Points:");
    console.log(summaryEnhanced);

    console.log(" Extracted Metadata:");
    console.log(metadata);

    const address = metadata?.address || "Address not found";
    const contact = metadata?.contact || "Contact not found";

    return formatComplaintNarrative({
      summaryPoints: summaryEnhanced,
      address,
      contact,
    });
  } catch (err) {
    console.error("Summary generation failed:", err);
    return "• Extraction failed. Please try again.";
  }
};
