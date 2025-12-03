import { createServerSupabaseClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, schoolName } = await request.json()

    if (!email || !password || !schoolName) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data: existing, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('[v0] Error checking existing admin:', checkError)
      throw checkError
    }

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Admin with this email already exists' }),
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new admin
    const { data: admin, error: insertError } = await supabase
      .from('admins')
      .insert([{
        email,
        password_hash: passwordHash,
        school_name: schoolName,
        created_at: new Date().toISOString(),
      }])
      .select('id, email, school_name')
      .single()

    if (insertError || !admin) {
      console.error('[v0] Error creating admin:', insertError)
      throw insertError || new Error('Failed to create admin')
    }

    return new Response(
      JSON.stringify({
        message: 'Admin created successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          school_name: admin.school_name,
        },
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Admin register error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
