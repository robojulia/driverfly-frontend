import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="logoicon">
    <Link href="/">
      <a>
        <img src="/dashboard/assets/images/logos/logo.png" />
      </a>
    </Link>
    </div>
  );
};

export default Logo;
