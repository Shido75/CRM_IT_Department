
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runUnitTests() {
    console.log('🧪 Starting Database Unit Tests...\n')

    // TEST 1: LEADS
    console.log('Test 1: Create Lead (Schema Check)')
    const testLead = {
        first_name: "UnitTest",
        last_name: "User",
        email: `test-${Date.now()}@example.com`,
        status: "new",
        company: "Test Corp"
    }

    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([testLead])
        .select()

    if (leadError) {
        console.error('❌ Lead Creation Failed:', JSON.stringify(leadError, null, 2))
    } else {
        console.log('✅ Lead Created Successfully:', leadData[0].id)
        // Cleanup
        await supabase.from('leads').delete().eq('id', leadData[0].id)
    }

    console.log('\n--------------------------------\n')

    // TEST 2: CLIENTS
    console.log('Test 2: Create Client (Schema Check)')
    const testClient = {
        name: "UnitTest Client", // Clients might still use 'name' or split? Let's assume name based on previous check, or check schema
        email: `client-${Date.now()}@example.com`,
        status: "active"
    }

    // Note: If clients table also has split names, this might fail, but let's test the 'name' column first as expected by original schema
    const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([testClient])
        .select()

    if (clientError) {
        console.error('❌ Client Creation Failed:', JSON.stringify(clientError, null, 2))

        if (clientError.message.includes('first_name')) {
            console.log('💡 HINT: Clients table also uses first_name/last_name. Code needs update.')
        }
    } else {
        console.log('✅ Client Created Successfully:', clientData[0].id)
        // Cleanup
        await supabase.from('clients').delete().eq('id', clientData[0].id)
    }
}

runUnitTests()
