import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import useAuth from '../../hooks/useAuth';

// In rewrite method you pass a page folder name(as a string). which // you create to handle underConstraction  functionalty.
export function middleware(req: NextRequest, ev: NextFetchEvent) {

  const { authCheck } = useAuth();

  console.log('middleware  authCheck', authCheck())
  // return NextResponse.redirect("/underConstraction");

  // if (authCheck()) {
    // return NextResponse.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard/driver`)
  // }

  // return NextResponse.redirect(`${process.env.FRONTEND_BASE_URL}/login`)
  return NextResponse.next()



}