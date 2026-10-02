import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("SmartNotes AI Backend is running!");
});

app.post("/summarize", async (req, res) => {

    try {

        const { notes, length, language } = req.body;

        if (!notes || notes.trim() === "") {
            return res.status(400).json({
                error: "Notes are required."
            });
        }

        const prompt = `
You are SmartNotes AI.

You are a helpful study assistant.

Summarize the following student's notes.

Output language:
${language}

Summary length:
${length}

Use simple language so that a student can easily understand.

Use this format:

SUMMARY:

Give a clear summary of the notes.

KEY POINTS:

- Important point 1
- Important point 2
- Important point 3
- Important point 4

IMPORTANT KEYWORDS:

keyword1, keyword2, keyword3, keyword4

Important rules:

1. Do not change the meaning of the notes.
2. Do not add unnecessary information.
3. Keep the answer easy to understand.
4. If the notes contain technical terms, explain them simply.

STUDENT NOTES:

${notes}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt
        });

        res.json({
            summary: response.text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message || "Gemini API request failed."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartNotes backend running on port ${PORT}`);
});