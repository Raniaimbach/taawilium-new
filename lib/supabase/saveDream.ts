import { supabase } from './client';

export async function saveDream(dream: string, interpretation: string, userId: string) {
  const { data, error } = await supabase.from('dreams').insert([
    {
      dream,
      interpretation,
      user_id: userId,
    }
  ]);

  if (error) {
    console.error('❌ Error saving dream:', error);
    throw error;
  }

  return data;
}