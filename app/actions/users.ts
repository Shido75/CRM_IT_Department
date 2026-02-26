'use server'

import { createClient } from '@supabase/supabase-js'

export async function createUser(userData: {
    email: string
    password: string
    full_name: string
    role: 'admin' | 'manager' | 'employee'
    department: string
}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
        return { success: false, error: 'Server configuration error: Missing Service Role Key' }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    try {
        // Create user with direct password — no email verification required
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,          // skips verification email entirely
            user_metadata: {
                full_name: userData.full_name,
            },
        })

        if (error) throw error

        // Create profile record
        if (data.user) {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: userData.email,
                    full_name: userData.full_name,
                    role: userData.role,
                    department: userData.department,
                    status: 'active',
                    requires_password_change: false,
                    updated_at: new Date().toISOString(),
                })

            if (profileError) throw profileError
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error creating user:', error)
        return { success: false, error: error.message || 'Failed to create user' }
    }
}

// Keep old inviteUser export for backward compat (redirects to createUser)
export async function inviteUser(userData: {
    email: string
    full_name: string
    role: 'admin' | 'manager' | 'employee'
    department: string
}) {
    return createUser({ ...userData, password: 'ChangeMe@123' })
}
