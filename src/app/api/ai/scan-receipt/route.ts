import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "DUMMY_KEY_FOR_DEV");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }
    
    const prompt = `Analyze this receipt and extract the following information in JSON format: 
    { "amount": number, "description": "merchant name or short description", "category": "One of: Traveling, Transport, Medical, Food, Grocery, Insurance, Loans, EMI, Other" }
    Only return the JSON object, nothing else.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(",")[1] || imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown formatting if the model returned it
    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    const extractedData = JSON.parse(cleanJson);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to process receipt" }, { status: 500 });
  }
}
