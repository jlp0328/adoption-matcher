import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(req: Request) {
  const body = await req.json()

  const prompt = `
You are an experienced dog adoption counselor.

APPLICATION:

${body.application}

DOG BIO:

${body.dogBio}

Analyze the applicant and dog.

Provide:

1. Match Summary
2. Strengths
3. Concerns
4. Questions for Foster
5. Questions for Applicant
6. Recommendation
`

  const completion = await openai.responses.create({
    model: 'gpt-5',
    input: prompt
  })

  return NextResponse.json({
    analysis: completion.output_text
  })
}