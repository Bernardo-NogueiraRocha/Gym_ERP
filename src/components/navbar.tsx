import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-blue-600 font-bold flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 ml-3">
        <Image 
          src='/dumbbell.svg' 
          width={30} 
          height={30} 
          alt="Dumbbell (logo for the website)"
          priority
	  className="w-5 h-5"
        />
        <span className="p-3">
          Home
        </span>
      </Link>
      <div className="p-3 me-4 flex gap-5 items-center">
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
