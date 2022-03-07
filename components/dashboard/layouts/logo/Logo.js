import LogoDark from "../../../../public/dashboard/assets/images/logos/logo.png";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="logoicon">
    <Link href="/">
      <a>
        <Image src={LogoDark} alt="logo" />
      </a>
    </Link>
    </div>
  );
};

export default Logo;
