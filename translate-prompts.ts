import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// ✅ تحميل ملف البيئة بصيغة .env.local
dotenv.config({ path: '.env.local' });

// ✅ تهيئة OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// ✅ مجلد القوالب
const baseDir = path.join(__dirname, 'prompts', 'components');

// ✅ دالة الترجمة إلى اللغة المحددة
async function translateText(text: string, targetLang: 'en' | 'de') {
  const systemPrompt = `You are a professional translator. Translate the following Arabic text into ${
    targetLang === 'en' ? 'English' : 'German'
  } with cultural and emotional sensitivity.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  });

  return completion.choices[0].message.content?.trim() || '';
}

// ✅ معالجة ملف واحد وترجمته
async function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const baseName = path.basename(filePath, '.ar.txt');
  const dirName = path.dirname(filePath);

  const english = await translateText(content, 'en');
  const german = await translateText(content, 'de');

  fs.writeFileSync(path.join(dirName, `${baseName}.en.txt`), english);
  fs.writeFileSync(path.join(dirName, `${baseName}.de.txt`), german);

  console.log(`✅ Translated ${baseName} to EN and DE`);
}

// ✅ المرور على المجلدات والملفات
function scanAndTranslate(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanAndTranslate(fullPath);
    } else if (entry.name.endsWith('.ar.txt')) {
      processFile(fullPath);
    }
  }
}

// ✅ بدء الترجمة
scanAndTranslate(baseDir);