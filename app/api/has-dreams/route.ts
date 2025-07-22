import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ hasDreams: false });
  }

  const { data, error } = await supabase
    .from('dream')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);

  const hasDreams = !error && data && data.length > 0;

  return NextResponse.json({ hasDreams });
}