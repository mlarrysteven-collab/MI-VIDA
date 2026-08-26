// Función de servidor (Vercel) que habla con la IA de Anthropic.
// Tu clave vive AQUÍ, en el servidor (variable de entorno), nunca en el navegador.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta configurar ANTHROPIC_API_KEY en Vercel." });
  }

  try {
    const { messages, system } = req.body || {};

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Puedes cambiar a "claude-haiku-4-5-20251001" si quieres algo más barato/rápido.
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await r.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "Error de la IA" });
    }

    const text = (data.content || [])
      .map((i) => (i.type === "text" ? i.text : ""))
      .filter(Boolean)
      .join("\n");

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
