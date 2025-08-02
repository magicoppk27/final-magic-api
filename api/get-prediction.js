import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const prediction = await kv.get('prediction');
    const currentPrediction = prediction || "[No prediction set]";
    return res.status(200).json({ prediction: currentPrediction });
  } catch (error) {
    console.error("KV Error on GET:", error);
    return res.status(500).json({ error: 'Failed to get prediction.' });
  }
}
