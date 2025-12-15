import Link from 'next/link';
export default function LegacyLogo() {
  return (
    <>
      <div className="logo">
        <Link href="/">
          <a>
            <img src="/img/DriverFly-Official-Favicon.png" className="logo" alt="DriverFly" />
          </a>
        </Link>
      </div>
    </>
  );
}
