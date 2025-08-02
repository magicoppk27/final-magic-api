const allowedOrigins = ["https://rodrigo.ie"];

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const prediction = await kv.get('prediction');
    const currentPrediction = prediction || "[No prediction set]";
    return res.status(200).json({ prediction: currentPrediction });
  } catch (error) {
    console.error("KV Error on GET:", error);
    return res.status(500).json({ error: 'Failed to get prediction.' });
  }
}
