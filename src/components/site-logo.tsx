import Image from "next/image";
import Link from "next/link";

export function SiteLogo({ href = "/" }: { href?: string }) {
  return (
    <Link className="brand site-logo" href={href} aria-label="CzęstoBusy - strona główna">
      <Image
        src="/images/czestobusy-logo-header-white.png"
        alt="CzęstoBusy - wynajem busów 9-osobowych i dostawczych"
        width={600}
        height={267}
        sizes="(max-width: 600px) 155px, 200px"
      />
    </Link>
  );
}
