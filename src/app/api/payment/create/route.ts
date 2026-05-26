import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { job_id } = await request.json()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: employerProfile, error: profileError } = await supabase
      .from('employer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !employerProfile) {
      return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 })
    }

    const typedEmployerProfile = employerProfile as { id: string }

    const { data: job, error: jobError } = await supabase
      .from('job_posts')
      .select(`
        *,
        job_applications (
          id,
          status,
          worker_id,
          worker_profiles (
            user_id
          )
        )
      ` as never)
      .eq('id', job_id)
      .eq('employer_id', typedEmployerProfile.id)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const typedJob = job as any
    const acceptedApplication = typedJob.job_applications?.find(
      (app: any) => app.status === 'accepted'
    )

    if (!acceptedApplication) {
      return NextResponse.json({ error: 'No accepted application found' }, { status: 400 })
    }

    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('job_id', job_id)
      .eq('payer_id', typedEmployerProfile.id)
      .single()

    if (existingTransaction) {
      return NextResponse.json({ error: 'Transaction already exists' }, { status: 400 })
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        job_id: job_id,
        payer_id: typedEmployerProfile.id,
        payee_id: acceptedApplication.worker_id,
        amount: typedJob.pay_amount,
        status: 'pending',
      } as never)
      .select()
      .single()

    if (transactionError) {
      return NextResponse.json({ error: transactionError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      transaction_id: (transaction as { id: string }).id,
      message: 'Payment initiated successfully',
      payment_url: `/dashboard/employer/jobs/${job_id}/payment?transaction_id=${(transaction as { id: string }).id}`
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

