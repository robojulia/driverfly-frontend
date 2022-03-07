import Link from "next/link";

export default function Login(props) {
    return (
        <>
            <Link href="/login">
                <button type="button" className={props.className}>Login</button>
            </Link>
        </>
    )
}