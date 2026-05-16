const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

export interface PredictionResult {
  prediction: "REAL" | "FAKE";
  confidence: number;
  probabilities: { real: number; fake: number };
  insights?: string[];
}

export async function predictNews(text: string): Promise<PredictionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`ML service responded ${res.status}`);
    }

    const data = await res.json();
    return {
      prediction: data.prediction,
      confidence: Number(data.confidence ?? 0),
      probabilities: data.probabilities ?? { real: 0, fake: 0 },
      insights: data.insights ?? [],
    };
  } finally {
    clearTimeout(timeout);
  }
}
