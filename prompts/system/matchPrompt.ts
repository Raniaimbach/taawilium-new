import fs from 'fs';
import path from 'path';

type Profile = {
  language: string;
  culture: string;
  tier: string;
  scientific: boolean;
  emotional_intensity?: 'low' | 'medium' | 'high';
};

type PromptEntry = {
  id: string;
  conditions: {
    culture?: string[];
    tier?: string[];
    language?: string[];
    scientific?: boolean;
    emotional_intensity?: string;
  };
  multilang: boolean;
  components: {
    persona: string;
    methodology: string;
    cultural_layer: string;
    output_format: string;
  };
};

export function matchPrompt(profile: Profile): PromptEntry | null {
  const filePath = path.resolve('prompts/system/prompt_map.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as { prompts: PromptEntry[] };

  const matches = data.prompts.filter((prompt) => {
    const c = prompt.conditions;

    if (c.language && !c.language.includes(profile.language)) return false;
    if (c.culture && !c.culture.includes(profile.culture)) return false;
    if (c.tier && !c.tier.includes(profile.tier)) return false;
    if (c.scientific !== undefined && c.scientific !== profile.scientific) return false;
    if (c.emotional_intensity && c.emotional_intensity !== profile.emotional_intensity) return false;

    return true;
  });

  return matches.length > 0 ? matches[0] : null;
}