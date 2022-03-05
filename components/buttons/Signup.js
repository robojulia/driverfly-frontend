import Link from "next/link";

export default function Signup() {
    return (
        <>
            <Link href="/signup">
                <button type="button" className="btn btn-primary mr-4">Sign Up</button>
            </Link>
        </>
    )
}