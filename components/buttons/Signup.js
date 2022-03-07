import Link from "next/link";

export default function Signup(props) {
    return (
        <>
            <Link href="/signup">
                <button type="button" className={props.className}>Sign Up</button>
            </Link>
        </>
    )
}