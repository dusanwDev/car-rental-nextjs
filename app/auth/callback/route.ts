import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_error&message=${encodeURIComponent(error.message)}`)
      }

      // Successful authentication
      const finalRedirect = redirectTo || '/residences' // Default redirect after successful login
      return NextResponse.redirect(`${origin}${finalRedirect}`)
      
    } catch (err) {
      console.error('OAuth exchange error:', err)
      return NextResponse.redirect(`${origin}/login?error=server_error`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
