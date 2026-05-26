import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { transaction_id, status } = await request.json()

    if (!transaction_id || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('transactions')
      .update({ status } as never)
      .eq('id', transaction_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (status === 'completed') {
      const { data: transaction } = await supabase
        .from('transactions')
        .select('job_id')
        .eq('id', transaction_id)
        .single()

      if (transaction) {
        await supabase
          .from('job_posts')
          .update({ status: 'completed' } as never)
          .eq('id', (transaction as { job_id: string }).job_id)
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
