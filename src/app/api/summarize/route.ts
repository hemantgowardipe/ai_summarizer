import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ summary: "API Error: " + data.error }, { status: 500 });
  }

  const summary = data[0]?.summary_text || "No summary returned.";
  return NextResponse.json({ summary });
}
