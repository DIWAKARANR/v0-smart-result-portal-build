import { createServerSupabaseClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data: admin, error: queryError } = await supabase
      .from('admins')
      .select('id, email, school_name, password_hash')
      .eq('email', email)
      .maybeSingle()

    if (queryError) {
      console.error('[v0] Error querying admin:', queryError)
      throw queryError
    }

    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)
    
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      )
    }

    return new Response(
      JSON.stringify({
        admin: {
          id: admin.id,
          email: admin.email,
          school_name: admin.school_name,
        },
        token: Buffer.from(`${admin.id}:${Date.now()}`).toString('base64'),
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
