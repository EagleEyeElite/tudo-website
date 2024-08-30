import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

export async function GET() {
  draftMode().disable()

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL), { status: 307 })
}
