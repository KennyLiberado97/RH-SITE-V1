import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface RiskReport {
  name: string;
  cpf: string;
  riskScore: number; // 0 to 100
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  summary: string;
  details: {
    criminal: string;
    financial: string;
    identity: string;
  };
  recommendation: string;
}

export async function generateRiskReport(name: string, cpf: string): Promise<RiskReport> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere um relatório de análise de risco fictício, mas realista, para uma plataforma de background check.
    Nome: ${name}
    CPF: ${cpf}
    
    O relatório deve ser em Português do Brasil e focado em recrutamento e seleção.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cpf: { type: Type.STRING },
          riskScore: { type: Type.NUMBER, description: "Score de 0 a 100, onde 0 é risco mínimo e 100 é risco máximo" },
          riskLevel: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"] },
          summary: { type: Type.STRING, description: "Resumo executivo da análise" },
          details: {
            type: Type.OBJECT,
            properties: {
              criminal: { type: Type.STRING, description: "Status de antecedentes criminais" },
              financial: { type: Type.STRING, description: "Status de restrições financeiras e crédito" },
              identity: { type: Type.STRING, description: "Status de validação de identidade e documentos" }
            },
            required: ["criminal", "financial", "identity"]
          },
          recommendation: { type: Type.STRING, description: "Recomendação final para o RH" }
        },
        required: ["name", "cpf", "riskScore", "riskLevel", "summary", "details", "recommendation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as RiskReport;
  } catch (error) {
    console.error("Erro ao processar resposta do Gemini:", error);
    throw new Error("Falha ao gerar o relatório de risco.");
  }
}
