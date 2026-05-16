import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { predictNews } from "@/lib/ml-client";

const schema = z.object({
  text: z.string().trim().min(20).max(20_000),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const limit = rateLimit(`predict:${userId}`, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Retry in ${limit.retryAfter}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Text must be 20–20,000 characters." },
      { status: 400 }
    );
  }

  try {
    const result = await predictNews(parsed.data.text);

    await prisma.analysisHistory.create({
      data: {
        userId,
        text: parsed.data.text,
        prediction: result.prediction,
        confidence: result.confidence,
      },
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("ML service error:", err);
    return NextResponse.json(
      {
        error:
          "ML service unavailable. Make sure the FastAPI backend is running on " +
          (process.env.ML_API_URL ?? "http://127.0.0.1:8000"),
      },
      { status: 503 }
    );
  }
}
