import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Make sure to set GOOGLE_APPLICATION_CREDENTIALS in your environment
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account.json"

const ai = new GoogleGenAI({apiKey: 'AIzaSyDMpbGxe-HEC_KucWEcs6qoFxxz269wsRU'});


app.post("/api/chat", async (req, res) => {
  const { message, type } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const model =
      type === "image"
        ? "gemini-2.5-flash-image-preview"
        : "gemini-2.5-pro";
    const response = await ai.models.generateContent({
  model,
  contents: message,
  config: {
    systemInstruction: `
      You are a helpful assistant. 
      Respond in the same language as the user's input. 
      If the input is Hindi, respond in Hindi. 
      If the input is English, respond in English.
      Always reply in plain text Markdown format.
    `,
  },
});


    const part = response.candidates[0].content.parts[0];

    if (type === "image" && part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");

      // Save image locally (optional)
      fs.writeFileSync("gemini-image.png", buffer);

      return res.json({
        type: "image",
        image: `data:image/png;base64,${imageData}`,
        savedAs: "gemini-image.png",
      });
    }

    if (type === "text" && part.text) {
      // const cleanReply = part.text.replace(/\*\*/g, "").replace(/\*/g, "").trim().replace(/\n{2,}/g, "\n");
      // console.log(part.text);
      
      return res.json({ type: "text", reply: part.text });
    }

    return res.status(500).json({ reply: "Could not generate content." });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ reply: err.message || err });
  }
});

app.use(express.static(path.join("build")));
const frontendBuildPath = path.join(__dirname, "./build");

app.use(express.static(frontendBuildPath));


// Catch-all for React Router (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
