import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-blue-600 font-bold flex justify-between">

      <Link href="/" className="flex gap-2">
        <Image src='/dumbbell.svg' width={30} height={30} alt="Dumbbell (logo for the website)" />
        <span className="p-3">
          Home
        </span>
      </Link>
      <div className="p-3 me-4 flex gap-5">
        <Link href="/plans">
          Plans
        </Link>

        <Link href="/account">
          Account
        </Link>
      </div>
    </nav>
  );
}