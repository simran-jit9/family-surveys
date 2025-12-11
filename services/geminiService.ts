import { GoogleGenAI, Type } from "@google/genai";
import { FamilyMember, ParsedMemberData, Gender, MaritalStatus } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses unstructured text description of a person into structured FamilyMember data.
 */
export const parseMemberFromText = async (text: string): Promise<ParsedMemberData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract family member details from this text: "${text}". 
      If a field is not mentioned, ignore it or use a reasonable guess based on context (e.g. if 'wife', gender is Female). 
      'parentSpouseName' maps to 'Husband/Father Name'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            parentSpouseName: { type: Type.STRING },
            relationWithHead: { type: Type.STRING },
            sex: { type: Type.STRING, enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER] },
            age: { type: Type.NUMBER },
            maritalStatus: { 
              type: Type.STRING, 
              enum: [
                MaritalStatus.SINGLE, 
                MaritalStatus.MARRIED, 
                MaritalStatus.DIVORCED, 
                MaritalStatus.WIDOWED, 
                MaritalStatus.SEPARATED
              ] 
            },
            healthProblems: { type: Type.STRING, description: "Description of health issues, or 'None' if healthy/not mentioned." },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return parsed as ParsedMemberData;
  } catch (error) {
    console.error("Gemini parse error:", error);
    throw new Error("Failed to parse text with AI.");
  }
};

/**
 * Generates a health summary and insights for a family.
 */
export const generateFamilyHealthSummary = async (members: FamilyMember[]): Promise<string> => {
  if (members.length === 0) return "No members to analyze.";

  const memberDescriptions = members.map(m => 
    `${m.name} (${m.age}, ${m.sex}): ${m.healthProblems}`
  ).join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following family health data and provide a concise summary (max 100 words). 
      Highlight any at-risk individuals or general observations.
      
      Data:
      ${memberDescriptions}`,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Error generating health summary.";
  }
};