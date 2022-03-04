import { NextResponse } from "next/server"

export async function middleware(req) {
  // return early if url isn't supposed to be protected
  debugger
  if (typeof window !== "undefined") {

    console.log('window', window)

    // localStorage.setItem(key, value)


    const data = localStorage.getItem('userData');
    console.log('datadatadatadata', data)
    if (!data) {
      return NextResponse.next()
    }

    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    if (!data) return NextResponse.redirect("/login")

    // If user is authenticated, continue.
    return NextResponse.next()
  }
}