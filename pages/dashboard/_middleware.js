import { NextResponse } from "next/server"
import useAuth from '../../hooks/useAuth'

export async function middleware() {

  const { authCheck } = useAuth();

  if (authCheck()) {
    return NextResponse.next()
  }
  // const base = process.env.APP_BASE_URL || "http://localhost:3000"
  // return NextResponse.redirect(`${base}/login`)

}