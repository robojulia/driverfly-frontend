import Link from "next/link";

export default function Login() {
    return (
        <>
            <Link href="/login">
                <button type="button" className="btn btn-primary mr-4">Login</button>
            </Link>
        </>
    )
}