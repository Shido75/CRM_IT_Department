'use server'

import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
        throw new Error('Server configuration error: Missing Service Role Key')
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}

export async function createUser(userData: {
    email: string
    password: string
    full_name: string
    role: 'admin' | 'manager' | 'employee'
    department: string
}) {
    try {
        const supabaseAdmin = getAdminClient()

        // Create user directly — no email verification
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: { full_name: userData.full_name },
        })

        if (error) throw error

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

export async function listUsers() {
    try {
        const supabaseAdmin = getAdminClient()

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id, email, full_name, role, department, status, created_at')
            .order('created_at', { ascending: false })

        if (error) throw error
        return { success: true, users: data || [] }
    } catch (error: any) {
        console.error('Error listing users:', error)
        return { success: false, error: error.message, users: [] }
    }
}

export async function deleteUser(userId: string) {
    try {
        const supabaseAdmin = getAdminClient()

        // Delete from auth.users — cascades to profiles
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting user:', error)
        return { success: false, error: error.message || 'Failed to delete user' }
    }
}

// Backward compat
export async function inviteUser(userData: {
    email: string
    full_name: string
    role: 'admin' | 'manager' | 'employee'
    department: string
}) {
    return createUser({ ...userData, password: 'ChangeMe@123' })
}
