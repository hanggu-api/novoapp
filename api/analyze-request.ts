import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Failed to initialize Gemini client:', e);
    }
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, mediaType, imageBase64 } = req.body || {};
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é o assistente de triagem inteligente da plataforma ProServiços.
Analise o pedido do cliente abaixo e extraia em JSON puro (sem markdown):
- category: escolha entre: "Eletricista", "Jardineiro", "Encanador", "Pintor", "Pedreiro", "Marceneiro", "Limpeza / Diarista", "Chaveiro", "Outros"
- serviceType: nome do serviço identificado (ex: "Troca de Lâmpada e Soquete")
- urgency: "Baixa", "Média" ou "Alta"
- estimatedDuration: tempo estimado razoável (ex: "1 a 2 horas")
- requiredTools: lista de ferramentas/materiais prováveis necessários (array de strings)
- technicalSummary: resumo claro e objetivo para os profissionais (máximo 2 frases)
- priceRangeEstimate: faixa de preço média de mercado no Brasil (ex: "R$ 80 - R$ 150")

Título: "${title || ''}"
Descrição/Áudio transcrito: "${description || ''}"
${imageBase64 ? '[O cliente anexou uma foto do problema]' : ''}`;

        const parts: any[] = [{ text: prompt }];

        if (imageBase64 && imageBase64.startsWith('data:image')) {
          const base64Data = imageBase64.split(',')[1];
          const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: parts,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          return res.status(200).json({ success: true, analysis: parsed });
        }
      } catch (aiErr) {
        console.warn('Gemini triage fallback on Vercel:', aiErr);
      }
    }

    // Heuristic fallback
    const fullText = `${title || ''} ${description || ''}`.toLowerCase();
    let category = 'Eletricista';
    let serviceType = 'Troca e Reparo Elétrico';
    let tools = ['Chave de teste', 'Escada', 'Fita isolante'];
    let priceRange = 'R$ 80 - R$ 150';

    if (fullText.includes('grama') || fullText.includes('jardim') || fullText.includes('poda')) {
      category = 'Jardineiro';
      serviceType = 'Corte de Grama e Poda de Jardim';
      tools = ['Cortador de grama', 'Tesoura de poda', 'Ancinho'];
      priceRange = 'R$ 120 - R$ 220';
    } else if (fullText.includes('vazamento') || fullText.includes('cano') || fullText.includes('torneira')) {
      category = 'Encanador';
      serviceType = 'Reparo Hidráulico e Desentupimento';
      tools = ['Chave inglesa', 'Fita veda rosca', 'Desentupidor'];
      priceRange = 'R$ 100 - R$ 180';
    }

    return res.status(200).json({
      success: true,
      analysis: {
        category,
        serviceType,
        urgency: fullText.includes('urgente') ? 'Alta' : 'Média',
        estimatedDuration: '1 a 3 horas',
        requiredTools: tools,
        technicalSummary: `Solicitação classificada como ${category} para ${serviceType}. Enviada para profissionais verificados da região.`,
        priceRangeEstimate: priceRange
      }
    });
  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message || 'Erro ao analisar pedido' });
  }
}
