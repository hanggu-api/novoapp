import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));

// Lazy initialize Gemini if available
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize Gemini client:", e);
    }
  }
  return aiClient;
}

// Endpoint to analyze service request (text, voice transcript, image descriptions)
app.post("/api/analyze-request", async (req, res) => {
  try {
    const { title, description, mediaType, imageBase64 } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é o assistente de triagem inteligente da plataforma ProServiços.
Analise o pedido do cliente abaixo e extraia em JSON puro (sem formatação markdown extra):
- category: A categoria profissional mais adequada (escolha estritamente entre: "Eletricista", "Jardineiro", "Encanador", "Pintor", "Pedreiro", "Marceneiro", "Limpeza / Diarista", "Chaveiro", "Outros")
- serviceType: nome curto do serviço identificado (ex: "Troca de Lâmpada e Soquete", "Corte de Grama e Poda")
- urgency: "Baixa", "Média" ou "Alta"
- estimatedDuration: tempo estimado razoável (ex: "1 a 2 horas")
- requiredTools: lista de ferramentas/materiais prováveis necessários (array de strings)
- technicalSummary: resumo claro e objetivo para os profissionais entenderem o problema (máximo 2 frases)
- priceRangeEstimate: faixa de preço média de mercado no Brasil para esse serviço (ex: "R$ 80 - R$ 150")

Título informado pelo cliente: "${title || ''}"
Descrição/Áudio transcrito: "${description || ''}"
${imageBase64 ? "[O cliente anexou uma foto do problema]" : ""}`;

        const parts: any[] = [{ text: prompt }];

        if (imageBase64 && imageBase64.startsWith("data:image")) {
          const base64Data = imageBase64.split(",")[1];
          const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: parts,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, analysis: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini analysis error, using fallback analyzer:", geminiError);
      }
    }

    // Smart heuristic fallback
    const fullText = `${title || ""} ${description || ""}`.toLowerCase();
    let category = "Eletricista";
    let serviceType = "Serviço Elétrico";
    let tools = ["Chave de fenda", "Multímetro", "Fita isolante"];
    let priceRange = "R$ 80 - R$ 160";

    if (fullText.includes("lâmpada") || fullText.includes("lampada") || fullText.includes("luz") || fullText.includes("tomada") || fullText.includes("disjuntor") || fullText.includes("fio") || fullText.includes("chuveiro")) {
      category = "Eletricista";
      serviceType = fullText.includes("lampada") || fullText.includes("lâmpada") ? "Troca de Lâmpada e Reator" : "Manutenção Elétrica";
      tools = ["Escada", "Lâmpadas adequadas", "Chave de teste", "Alicate"];
      priceRange = "R$ 70 - R$ 140";
    } else if (fullText.includes("grama") || fullText.includes("jardim") || fullText.includes("poda") || fullText.includes("árvore") || fullText.includes("planta")) {
      category = "Jardineiro";
      serviceType = "Corte de Grama e Manutenção de Jardim";
      tools = ["Cortador de grama", "Tesoura de poda", "Sacos de descarte", "Ancinho"];
      priceRange = "R$ 120 - R$ 250";
    } else if (fullText.includes("vazamento") || fullText.includes("torneira") || fullText.includes("cano") || fullText.includes("pia") || fullText.includes("ralo") || fullText.includes("descarga")) {
      category = "Encanador";
      serviceType = "Reparo Hidráulico e Desentupimento";
      tools = ["Chave grifo", "Fita veda rosca", "Vedações de reposição", "Desentupidor"];
      priceRange = "R$ 90 - R$ 190";
    } else if (fullText.includes("pintar") || fullText.includes("tinta") || fullText.includes("parede") || fullText.includes("massa")) {
      category = "Pintor";
      serviceType = "Pintura e Retoque de Paredes";
      tools = ["Rolos de lã", "Fita crepe", "Lixa", "Bandeja de tinta"];
      priceRange = "R$ 150 - R$ 350";
    } else if (fullText.includes("porta") || fullText.includes("móvel") || fullText.includes("armário") || fullText.includes("madeira")) {
      category = "Marceneiro";
      serviceType = "Ajuste ou Reparo de Marcenaria";
      tools = ["Parafusadeira", "Dobradiças", "Nível", "Trena"];
      priceRange = "R$ 100 - R$ 220";
    } else if (fullText.includes("fechadura") || fullText.includes("chave") || fullText.includes("tranca")) {
      category = "Chaveiro";
      serviceType = "Troca ou Abertura de Fechadura";
      tools = ["Michas", "Chaves de fenda", "Fechadura compatível"];
      priceRange = "R$ 90 - R$ 180";
    } else if (fullText.includes("limpeza") || fullText.includes("faxina") || fullText.includes("diarista")) {
      category = "Limpeza / Diarista";
      serviceType = "Higienização e Limpeza";
      tools = ["Produtos de limpeza", "Panos de microfibra", "Aspirador"];
      priceRange = "R$ 150 - R$ 250";
    }

    return res.json({
      success: true,
      analysis: {
        category,
        serviceType,
        urgency: fullText.includes("urgente") || fullText.includes("rápido") || fullText.includes("hoje") ? "Alta" : "Média",
        estimatedDuration: "1 a 3 horas",
        requiredTools: tools,
        technicalSummary: `Solicitação classificada como ${category} para ${serviceType}. Enviada para profissionais verificados da região.`,
        priceRangeEstimate: priceRange
      }
    });
  } catch (err: any) {
    console.error("API error:", err);
    return res.status(500).json({ error: err.message || "Erro ao analisar pedido" });
  }
});

// Vercel Postgres Database Health Status
app.get("/api/db-status", async (req, res) => {
  const isConfigured = !!process.env.POSTGRES_URL;
  res.json({
    status: "ok",
    vercelPostgresConnected: isConfigured,
    mode: isConfigured ? "vercel_postgres" : "in_memory_simulation",
    database: process.env.POSTGRES_DATABASE || "local_mock",
    host: process.env.POSTGRES_HOST ? "Neon / Vercel Cloud" : "localhost",
    message: isConfigured
      ? "Conexão com o Vercel Postgres ativa com sucesso!"
      : "Vercel Postgres pronto para conexão (basta vincular no painel da Vercel)."
  });
});

// Initialize Vercel Postgres schema
app.post("/api/init-db", async (req, res) => {
  try {
    if (!process.env.POSTGRES_URL) {
      return res.json({
        success: true,
        mode: "mock",
        message: "Modo de simulação ativo. Vincule um banco Vercel Postgres nas configurações da Vercel para persistência na nuvem."
      });
    }

    const { initVercelDatabase } = await import("./src/lib/db.js").catch(async () => await import("./src/lib/db"));
    const result = await initVercelDatabase();
    return res.json(result);
  } catch (err: any) {
    console.error("Database init error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express server and connect Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
