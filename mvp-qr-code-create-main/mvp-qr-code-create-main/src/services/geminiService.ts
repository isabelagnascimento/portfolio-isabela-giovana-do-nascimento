import { GoogleGenAI, Type } from "@google/genai";

// Initialization with environment variable as per skill
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface QrAIOptions {
  data?: string;
  dotsOptions?: {
    type?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    color?: string;
  };
  backgroundOptions?: {
    color?: string;
  };
  cornersSquareOptions?: {
    type?: 'square' | 'dot' | 'rounded' | 'extra-rounded';
    color?: string;
  };
  cornersDotOptions?: {
    type?: 'square' | 'dot';
    color?: string;
  };
}

export const generateQrConfig = async (prompt: string): Promise<QrAIOptions | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform this request into a QR code design configuration: "${prompt}"`,
      config: {
        systemInstruction: `You are an expert QR code designer. 
        Analyze the user's prompt and extract design preferences like colors, shapes, and styles.
        Return only the JSON configuration that fits the schema.
        Dots types: 'square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'.
        Corner styles: 'square', 'dot', 'rounded', 'extra-rounded'.
        Default colors to high contrast (e.g., black on white) if not specified, but try to match the brand/vibe described.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            data: { type: Type.STRING, description: "The content of the QR code (URL or text)" },
            dotsOptions: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "Style of the dots" },
                color: { type: Type.STRING, description: "Hex color of the dots" }
              }
            },
            backgroundOptions: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING, description: "Hex background color" }
              }
            },
            cornersSquareOptions: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "Style of the corner squares" },
                color: { type: Type.STRING, description: "Hex color of the corner squares" }
              }
            },
            cornersDotOptions: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "Style of the corner dots" },
                color: { type: Type.STRING, description: "Hex color of the corner dots" }
              }
            }
          }
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text) as QrAIOptions;
  } catch (error) {
    console.error("Gemini QR generation error:", error);
    return null;
  }
};
