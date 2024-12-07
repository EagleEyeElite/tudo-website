import {NextRequest, NextResponse} from 'next/server'
import { draftMode } from 'next/headers'

export async function GET(request: NextRequest) {
  (await draftMode()).disable()
  const url = new URL("/", request.url);
  return NextResponse.redirect(url, { status: 307 })
}
