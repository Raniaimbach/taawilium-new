import { OpenAI } from "openai";

export async function deliverPrompt(
  dream: string,
  systemPrompt: string,
  openai: OpenAI
): Promise<string> {
  try {
    // استبدال {{dream}} بالحلم الفعلي داخل القالب
    const userPrompt = systemPrompt.replace(/\{\{\s*dream\s*\}\}/g, dream);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7
    });

    const result = chatResponse.choices[0]?.message?.content || '❌ لم يتم الحصول على تفسير.';
    return result;
  } catch (err) {
    console.error("❌ OpenAI delivery error:", err);
    return '❌ حدث خطأ أثناء التفسير.';
  }
}