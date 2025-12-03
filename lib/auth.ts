// Authentication utilities
import { createClient } from './supabase'
import { createServerSupabaseClient } from './supabase'
import bcrypt from 'bcryptjs'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Admin registration
export async function registerAdmin(email: string, password: string, schoolName: string) {
  const supabase = createClient()
  const hashedPassword = await hashPassword(password)

  const { data, error } = await supabase
    .from('admins')
    .insert([
      {
        email,
        password_hash: hashedPassword,
        school_name: schoolName,
      },
    ])
    .select()

  return { data, error }
}

// Admin login
export async function loginAdmin(email: string, password: string) {
  const supabase = createClient()

  const { data: admins, error: queryError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single()

  if (queryError || !admins) {
    return { data: null, error: 'Admin not found' }
  }

  const passwordMatch = await comparePassword(password, admins.password_hash)
  if (!passwordMatch) {
    return { data: null, error: 'Invalid password' }
  }

  // Store in session/localStorage
  return { data: admins, error: null }
}

// Get current admin
export async function getCurrentAdmin() {
  const supabase = createClient()
  const adminData = typeof window !== 'undefined' ? localStorage.getItem('admin') : null
  return adminData ? JSON.parse(adminData) : null
}
