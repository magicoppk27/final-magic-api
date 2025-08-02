const allowedOrigins = ["https://rodrigo.ie"];

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prediction } = req.body || {};
    if (!prediction) {
      return res.status(400).json({ error: "Prediction value is missing." });
    }

    await kv.set('prediction', prediction);
    return res.status(200).json({ message: `Prediction set to: ${prediction}` });
  } catch (error) {
    console.error("KV Error on SET:", error);
    return res.status(500).json({ error: "Failed to set prediction." });
  }
}
