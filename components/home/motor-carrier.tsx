import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";
import Image from "next/image";

export default function MotorCarrier() {

    const { t } = useTranslation();

    return (
        <section className="motor-carrier-bg">

            <div className="motor-carrier-top-bg">
            </div>
            <div className="motor-carrier-bottom-bg">
            </div>
        </section>
    )
}