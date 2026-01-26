'use server'

import { createClient } from '@supabase/supabase-js'

export async function inviteUser(userData: {
    email: string
    full_name: string
    role: 'admin' | 'manager' | 'employee'
    department: string
}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
        return { success: false, error: 'Server configuration error: Missing Service Key' }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    try {
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(userData.email)

        if (error) throw error

        // Create or update profile
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
                    updated_at: new Date().toISOString()
                })

            if (profileError) throw profileError
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error inviting user:', error)
        return { success: false, error: error.message || 'Failed to invite user' }
    }
}
