// api/zae-chat.js
// Serverless function (Vercel) — jembatan antara widget "Zae AI" di frontend
// dan Gemini API. API key HARUS disimpan di sini (env var), jangan pernah
// dipanggil langsung dari browser, karena kalau dari frontend key-nya bakal
// kelihatan siapa aja yang buka DevTools.
//
// Setup:
// 1. Taruh file ini di root project, folder: /api/zae-chat.js
//    (Vercel otomatis mendeteksi folder /api sebagai serverless functions,
//    tidak perlu config tambahan untuk project Vite/React biasa)
// 2. Di dashboard Vercel: Project Settings → Environment Variables
//    tambahkan GEMINI_API_KEY = <api key kamu dari https://aistudio.google.com/apikey>
// 3. Redeploy. Endpoint otomatis aktif di: https://<domain-kamu>/api/zae-chat
//
// Untuk testing lokal, install Vercel CLI (`npm i -g vercel`) lalu jalankan
// `vercel dev` (bukan `npm run dev` biasa), dan isi file `.env.local`:
//   GEMINI_API_KEY=xxxxx

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `Kamu adalah Zae AI, asisten AI dari portofolio Zae Labs milik Irsya Zaelani (Zae),
seorang mahasiswa & developer yang mengerjakan web development, automation, dan integrasi AI.
Jawab dengan ramah, singkat (1-4 kalimat), dan natural dalam Bahasa Indonesia santai —
karena jawabanmu kadang akan dibacakan lewat suara (text-to-speech), jadi hindari format
markdown, bullet list, atau simbol aneh yang janggal kalau dibacakan.`;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply: "Otak AI-ku belum tersambung (GEMINI_API_KEY belum diisi di server). Coba lagi nanti ya.",
    });
  }

  try {
    const { message, history } = req.body || {};
    const clean = (message ?? "").toString().trim();
    if (!clean) return res.status(400).json({ error: "Pesan kosong" });

    // history: array of { role: "user" | "assistant", text: string } dari frontend,
    // dipetakan ke format contents Gemini (role "model" untuk balasan AI).
    const pastTurns = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.text)
          .slice(-8)
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: String(m.text).slice(0, 2000) }],
          }))
      : [];

    const contents = [...pastTurns, { role: "user", parts: [{ text: clean }] }];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { maxOutputTokens: 300, temperature: 0.8 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Gemini API error:", geminiRes.status, errText);
      return res.status(200).json({
        reply: "Lagi ada gangguan pas nyambung ke otak AI-ku, coba lagi sebentar lagi ya.",
      });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() ||
      "Maaf, aku belum bisa jawab itu.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("zae-chat handler error:", err);
    return res.status(200).json({
      reply: "Ada error di server pas mroses pesanmu, coba lagi ya.",
    });
  }
};
