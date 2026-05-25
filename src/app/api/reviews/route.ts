import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { job_id, rating, comment } = await request.json()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Determine if user is employer or worker
    const { data: employerProfile } = await supabase
      .from('employer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let reviewer_id: string | null = null
    let reviewee_id: string | null = null

    if (employerProfile) {
      // Employer is reviewing worker
      reviewer_id = employerProfile.id
      
      // Get the worker who did the job
      const { data: job } = await supabase
        .from('job_posts')
        .select(`
          job_applications (
            worker_id,
            status
          )
        `)
        .eq('id', job_id)
        .eq('employer_id', employerProfile.id)
        .single()

      const acceptedApplication = job?.job_applications?.find(
        (app: any) => app.status === 'accepted'
      )

      if (acceptedApplication) {
        reviewee_id = acceptedApplication.worker_id
      }
    } else {
      // Worker is reviewing employer
      const { data: workerProfile } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (workerProfile) {
        reviewer_id = workerProfile.id
        
        // Get the employer
        const { data: job } = await supabase
          .from('job_posts')
          .select('employer_id')
          .eq('id', job_id)
          .single()

        if (job) {
          reviewee_id = job.employer_id
        }
      }
    }

    if (!reviewer_id || !reviewee_id) {
      return NextResponse.json({ error: 'Invalid review context' }, { status: 400 })
    }

    // Create review
    const { error } = await supabase.from('reviews').insert({
      job_id,
      reviewer_id,
      reviewee_id,
      rating,
      comment,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You have already reviewed this job' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
