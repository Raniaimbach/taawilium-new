import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });

  const { content, interpretation, user_id } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 401 });
  }

  const { error } = await supabase.from('dream').insert([
    { content, interpretation, user_id }
  ]);

  if (error) {
    console.error('Database insert error:', error.message);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}