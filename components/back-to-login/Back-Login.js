import Back from '../../public/css/BackToLogin.module.css'
import Link from 'next/link'
export default function BackToLogin() {
    return (
        <>
            <p className=" m-5 text-secondary  p-lg-0 p-2 ">Don't have an account? Make one
                <Link href="/signup">
                    <a className={Back.link}> here!</a>
                </Link>
            </p>
        </>
    )

}
