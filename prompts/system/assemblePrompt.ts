import fs from 'fs';
import path from 'path';

type Components = {
  persona: string;
  methodology: string;
  cultural_layer: string;
  output_format: string;
};

export function assemblePrompt(components: Components, language: string): string {
  const parts = [];
  const basePath = path.resolve('prompts/components');

  // 🧩 تحميل كل مكون من ملف .txt حسب اللغة (مثلاً ibn_sirin_modern.ar.txt)
  for (const [key, name] of Object.entries(components)) {
    const filePath = `${basePath}/${key}s/${name}.${language}.txt`;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      parts.push(`### ${key.toUpperCase()}:\n${content}`);
    } catch (err) {
      console.warn(`⚠️ ملف مفقود: ${filePath}`);
    }
  }

  // ⚙️ توليف prompt كامل يحتوي على: الشخصية + المنهجية + الطبقة الثقافية + الشكل النهائي + مكان للحلم
  const fullPrompt = parts.join('\n\n') + '\n\n### DREAM:\n{{dream}}';

  return fullPrompt;
}