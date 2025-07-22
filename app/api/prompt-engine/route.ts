import { NextResponse } from "next/server";
import { matchPrompt } from '@/prompts/system/matchPrompt';
import { assemblePrompt } from '@/prompts/system/assemblePrompt';
import { deliverPrompt } from '@/prompts/system/deliverPrompt';
import OpenAI from "openai";

// إنشاء كائن OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dream, profile, mode } = body;

    if (!dream || !profile || !mode) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    // اختيار مكونات البرومبت المناسبة
    const matched = matchPrompt(profile);
    if (!matched) {
      throw new Error("❌ لا يوجد قالب مناسب لهذا المستخدم بعد.");
    }

    // توليف البرومبت الكامل (مع المكونات)
    const systemPrompt = assemblePrompt(matched.components, profile.language);

    // تسليم الطلب إلى OpenAI (system = القالب، user = الحلم)
    const result = await deliverPrompt(dream, systemPrompt, openai);

    return NextResponse.json({ result, promptId: matched.id });
  } catch (err) {
    console.error("❌ Prompt Engine Error:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}