import { NextResponse } from "next/server"
import useAuth from '../../hooks/useAuth';
import { useRouter } from "next/router";
import  { NextFetchEvent } from 'next/server'
import  { NextRequest } from 'next/server'

export async function middleware(NextRequest, NextFetchEvent) {

  const { authCheck } = useAuth();
  // const router = useRouter();

  if (authCheck()) {
    return NextResponse.next()
  }

  // router.push('/')
  // return NextResponse.redirect("/login")

}