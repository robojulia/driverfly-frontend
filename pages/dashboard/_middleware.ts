import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import useAuth from '../../hooks/useAuth';

// In rewrite method you pass a page folder name(as a string). which // you create to handle underConstraction  functionalty.
export function middleware(req: NextRequest, ev: NextFetchEvent) {

  const { authCheck } = useAuth();

  // return NextResponse.rewrite("/underConstraction");

  console.log('middleware  authCheck', authCheck())
  // if (authCheck()) {
    // console.log('not auth')
    // return NextResponse.rewrite(`${process.env.FRONTEND_BASE_URL}/dashboard/driver`)
  // }

  // console.log('auth')
  // return NextResponse.rewrite(`${process.env.FRONTEND_BASE_URL}/login`)
  // return NextResponse.next()



}