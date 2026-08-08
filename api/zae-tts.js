// api/zae-tts.js
// Serverless function (Vercel) — text-to-speech pakai suara neural Microsoft
// Edge Read Aloud (GRATIS, sama seperti yang dipakai di proyek Nala kamu:
// id-ID-GadisNeural). Jauh lebih natural dibanding Web Speech API bawaan
// browser karena ini suara neural asli, bukan TTS sintetis biasa.
//
// Setup:
// 1. Taruh file ini di /api/zae-tts.js (sejajar dengan api/zae-chat.js)
// 2. Install package: npm install msedge-tts
// 3. Push & redeploy — tidak butuh API key apa pun untuk fitur ini.

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Suara wanita Indonesia paling natural yang tersedia — sama seperti Nala.
// Alternatif lain kalau mau ganti nuansa suara: "id-ID-GadisNeural" (default).
const VOICE = "id-ID-GadisNeural";
const RATE = "-4%";   // sedikit lebih pelan = lebih natural, tidak buru-buru
const PITCH = "+0Hz"; // nada natural, tidak dibikin cempreng/robotic

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body || {};
    const clean = (text ?? "").toString().trim().slice(0, 1000);
    if (!clean) return res.status(400).json({ error: "Teks kosong" });

    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(clean, { rate: RATE, pitch: PITCH });

    const chunks = [];
    for await (const chunk of audioStream) chunks.push(chunk);
    const audioBuffer = Buffer.concat(chunks);

    if (!audioBuffer.length) {
      return res.status(502).json({ error: "Tidak ada audio yang dihasilkan" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);
  } catch (err) {
    console.error("zae-tts handler error:", err);
    return res.status(500).json({ error: "TTS gagal, coba lagi." });
  }
}
