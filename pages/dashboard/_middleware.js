import { NextResponse } from "next/server"
import useAuth from '../../hooks/useAuth';

export async function middleware(req, NextResponse) {

  const { authCheck } = useAuth();

  if (authCheck()) {
    return NextResponse.next()
  }

  // return NextResponse.redirect("/login")

}